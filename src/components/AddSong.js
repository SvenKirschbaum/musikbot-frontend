import React, {Component} from "react";
import GlobalContext from "./GlobalContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Autosuggest from "react-autosuggest";
import Button from "react-bootstrap/Button";
import {debounce, throttle} from "throttle-debounce";

import './AddSong.css';
import Config from "./Configuration";

class AddSong extends Component {

    static contextType = GlobalContext;

    _cache = {};

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            request: '',
            loading: false,
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
        this.setState({request: value}, () => {
            const q = this.state.request;
            const cached = this._cache[q];
            if(cached) {
                this.setState({
                    suggestions: cached
                });
            }


            if(q.length < 5 || q.endsWith(' ')) {
                this.loadThrottled(this.state.request);
            }
            else {
                this.loadDebounced(this.state.request);
            }
        });
    };

    loadSuggestions(value) {
        const cached = this._cache[value];
        if(cached) {
            this.setState({
                suggestions: cached
            });
            return;
        }

        this.waitfor = value;
        let headers = new Headers(this.context.defaultHeaders);
        headers.set("Content-Type","text/plain");
        fetch(Config.apihost + "/api/v2/search?term="+encodeURIComponent(value), {
            method: 'GET',
            headers: headers
        }).then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
            .then((res) => res.json())
            .then((res) => {
                this._cache[value] = res;
                if(value !== this.waitfor) return;
                this.setState({
                    suggestions: res
                });
            })
            .catch(reason => {
                this.props.handlefetchError(reason);
            });
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    getSuggestionValue (suggestion) {
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

export default AddSong;