import React, {Component} from 'react';

import './Version.css';
import GlobalContext from "./GlobalContext";
import Config from './Configuration';

class Version extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);

        this.state = {
            frontend: Config.version,
            backend: "~",
        };
    }

    componentDidMount() {
        fetch(Config.apihost + "/api/version", {
            method: 'GET',
            headers: this.context.defaultHeaders
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