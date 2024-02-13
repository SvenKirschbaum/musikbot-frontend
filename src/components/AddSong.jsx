import {useCallback, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {debounce, throttle} from "throttle-debounce";

import './AddSong.css';
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {useCombobox} from "downshift";

export default function AddSong(props) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const client = useStompClient();
    useSubscription('/user/queue/search', (message) => {
        const content = JSON.parse(message.body);
        setSuggestions(content);
    });

    const loadSuggestions = useCallback((value) => {
        client.publish({destination: '/musikbot/search', body: value});
    }, [client]);

    const loadThrottled = useCallback(throttle(500, loadSuggestions), [loadSuggestions]);
    const loadDebounced = useCallback(debounce(500, loadSuggestions), [loadSuggestions]);

    const submit = (e) => {
        e.preventDefault();
        props.sendSong(inputValue);
        setInputValue('');
    }

    let {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
    } = useCombobox({
        onInputValueChange({inputValue}) {
            setInputValue(inputValue);
            if (inputValue.trim().length === 0) {
                setSuggestions([]);
                loadDebounced('');
            } else if (inputValue.length < 5 || inputValue.endsWith(' ')) {
                loadThrottled(inputValue);
            } else {
                loadDebounced(inputValue);
            }
        },
        items: suggestions,
        itemToString(item) {
            return item ? item.value : ''
        },
        inputValue
    })

    return (
        <section>
            <Row className="space-top space-bottom justify-content-center">
                <Col className="addSong" xl={{span: 4}} md={{span: 6}} xs={{span: 11}}>
                    <Row>
                        <Col xs={{span: 12}} md={{span: 8}}>
                            <input
                                className="addSongInput w-full p-1.5"
                                {...getInputProps({
                                    onKeyDown: (e) => {
                                        if ((!isOpen || suggestions.length === 0) && e.key === 'Enter') {
                                            submit(e);
                                        }
                                    }
                                })}
                            />
                        </Col>
                        <Col xs={{span: 12}} md={{span: 4}}>
                            <Button
                                aria-label="toggle menu"
                                className="px-2"
                                type="button"
                                {...getToggleButtonProps()}
                                onClick={submit}
                            >
                                {props.buttontext}
                            </Button>
                        </Col>
                        <Col>
                            <ul
                                className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 p-0 z-10 ${
                                    !(isOpen && suggestions.length) && 'hidden'
                                }`}
                                {...getMenuProps()}
                            >
                                {isOpen &&
                                    suggestions.map((item, index) => (
                                        <li
                                            className={`suggestion py-2 px-3 shadow-sm flex flex-col ${index === highlightedIndex ? 'highlighted' : ''}`}
                                            key={item.value}
                                            {...getItemProps({item, index})}
                                        >
                                            <div className="suggestion-label">{item.label}</div>
                                            <div className="suggestion-link">{item.value}</div>
                                        </li>
                                    ))}
                            </ul>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
}
