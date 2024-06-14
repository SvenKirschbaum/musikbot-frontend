import {useContext} from 'react';

import './QuickAdd.css';

import {FaPlus} from 'react-icons/fa';
import Config from "./Configuration";
import {AlertContext} from "../context/AlertContext";
import useDefaultHeaders from "../hooks/defaultHeaders";

function QuickAdd(props) {

    const alerts = useContext(AlertContext);
    const defaultHeaders = useDefaultHeaders();

    const onClick = () => {
        let headers = new Headers(defaultHeaders);
        headers.set("Content-Type", "text/plain");
        fetch(Config.apihost + "/api/v2/songs", {
            method: 'POST',
            body: props.children,
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        })
            .then((res) => res.json())
            .then((res) => {
                let type = res.success ? 'success' : 'danger';
                if (res.warn && res.success) type = 'warning';
                alerts.addAlert({
                    id: Math.random().toString(36),
                    type: type,
                    text: res.message,
                    autoclose: true
                });
            })
            .catch(reason => {
                alerts.handleException(reason);
            })
    }

    return (
        <div className="quickadd" onClick={onClick}><FaPlus/></div>
    );
}

export default QuickAdd;