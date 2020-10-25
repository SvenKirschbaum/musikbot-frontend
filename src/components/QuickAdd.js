import {Component} from 'react';

import './QuickAdd.css';

import {FaPlus} from 'react-icons/fa';
import GlobalContext from "./GlobalContext";
import Config from "./Configuration";
import {getDefaultHeaders} from "../hooks/defaultHeaders";

class QuickAdd extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        let headers = getDefaultHeaders();
        headers.set("Content-Type", "text/plain");
        fetch(Config.apihost + "/api/v2/songs", {
            method: 'POST',
            body: this.props.children,
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        })
            .then((res) => res.json())
            .then((res) => {
                let type = res.success ? 'success' : 'danger';
                if (res.warn && res.success) type = 'warning';
                this.context.addAlert({
                    id: Math.random().toString(36),
                    type: type,
                    text: res.message,
                    autoclose: true
                });
            })
            .catch(reason => {
                this.context.handleException(reason);
            })
    }

    render() {
        return (
            <div className="quickadd" onClick={this.onClick}><FaPlus /></div>
        );
    }
}

export default QuickAdd;