import React, {Component} from 'react';

import './Version.css';
import GlobalContext from "./GlobalContext";
import Config from './Configuration';

class Version extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);

        this.abortController = new AbortController();

        this.state = {
            frontend: Config.version,
            backend: "~",
        };
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    componentDidMount() {
        fetch(Config.apihost + "/api/version", {
            method: 'GET',
            headers: this.context.defaultHeaders,
            signal: this.abortController.signal
        })
        .then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => res.json())
        .then(value => this.setState({backend: value.version}))
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    render() {
        return (
            <ul className="version d-none d-lg-block">
                <li>Frontend v{this.state.frontend}</li>
                <li>Backend v{this.state.backend}</li>
            </ul>
        );
    }
}

export default Version;