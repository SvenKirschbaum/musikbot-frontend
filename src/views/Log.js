import {Component} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';

import './Log.css';
import Config from "../components/Configuration";

class Log extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            log: ""
        };

        this.abortController = new AbortController();

        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    load() {
        fetch(Config.apihost + "/api/manage/logfile", {
            method: 'GET',
            headers: this.context.defaultHeaders,
            signal: this.abortController.signal
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => {
            res.text().then(value => this.setState({log: value}));
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
                    <Col className="log">
                        {this.state.log}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Log;