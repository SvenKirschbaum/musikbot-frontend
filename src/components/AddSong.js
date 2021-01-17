import {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Autosuggest from "react-autosuggest";
import Button from "react-bootstrap/Button";
import {debounce, throttle} from "throttle-debounce";

import './AddSong.css';
import {withStompClient, withSubscription} from "react-stomp-hooks";

class AddSong extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadSuggestions = this.loadSuggestions.bind(this);

        this.loadDebounced = debounce(500, this.loadSuggestions);
        this.loadThrottled = throttle(500, this.loadSuggestions);
    }

    handleChange(event, {newValue}) {
        this.setState({value: newValue});
    }

    onSuggestionsFetchRequested = ({ value }) => {
        if (value.length < 5 || value.endsWith(' ')) {
            this.loadThrottled(value);
        } else {
            this.loadDebounced(value);
        }
    };

    loadSuggestions(value) {
        this.props.stompClient.publish({destination: '/musikbot/search', body: value});
    }

    onMessage = (message) => {
        const content = JSON.parse(message.body);
        this.setState({
            suggestions: content
        });
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    getSuggestionValue(suggestion) {
        return suggestion.value;
    }

    renderSuggestion = suggestion => (
        <div className="ac-entry">
            <span className="ac-title">{suggestion.label}</span><br />
            <span className="ac-link">{suggestion.value}</span>
        </div>
    );

    handleSubmit(event) {
        event.preventDefault();
        this.props.sendSong(this.state.value);
        this.setState({value: ""});
    }

    render() {
        const inputProps = {
            value: (this.state.value === undefined) ? '' : this.state.value,
            onChange: this.handleChange,
            className: "w-100 h-100",
            'aria-label': "Song Link"
        };

        return (
            <section>
                <Row className="space-top justify-content-center">
                    <Col className="addSong" xl={{span: 4}} md={{span: 6}} xs={{span: 11}}>
                        <form onSubmit={this.handleSubmit}>
                            <Row noGutters>
                                <Col xs={{span:12}} md={{span:8}}>
                                    <Autosuggest
                                        suggestions={this.state.suggestions}
                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                        getSuggestionValue={this.getSuggestionValue}
                                        renderSuggestion={this.renderSuggestion}
                                        inputProps={inputProps}
                                    />
                                </Col>
                                <Col xs={{span:12}} md={{span:4}}><Button type="submit">{this.props.buttontext}</Button></Col>
                            </Row>
                        </form>
                    </Col>
                </Row>
            </section>
        );
    }
}

export default withStompClient(withSubscription(AddSong, '/user/queue/search'));