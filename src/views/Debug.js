import {Component} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';

import './Debug.css';
import Config from "../components/Configuration";
import {getDefaultHeaders} from "../hooks/defaultHeaders";

class Debug extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);

        this.onServer = this.onServer.bind(this);
        this.onClient = this.onClient.bind(this);
    }

    onServer() {
        fetch(Config.apihost + "/api/debug/server", {
            method: ('POST'),
            headers: getDefaultHeaders()
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    onClient() {
        fetch(Config.apihost + "/api/debug/client", {
            method: ('POST'),
            headers: getDefaultHeaders()
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <Row className="justify-content-center">
                    <Col className="text-center debug">
                        <button onClick={this.onServer}>Server neustarten</button>
                        <button onClick={this.onClient}>Client neustarten</button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Debug;