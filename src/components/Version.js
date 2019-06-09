import React, {Component} from 'react';

import './Version.css';
import AuthenticationContext from "./AuthenticationContext";

class Version extends Component {

    static contextType = AuthenticationContext;

    constructor(props) {
        super(props);

        this.state = {
            frontend: process.env.REACT_APP_VERSION || "~",
            backend: "~",
        };
    }

    componentDidMount() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/version", {
            method: 'GET',
            headers: headers
        })
        .then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => res.json())
        .then(value => this.setState({backend: value.version}))
        .catch(reason => {
            console.error(reason);
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