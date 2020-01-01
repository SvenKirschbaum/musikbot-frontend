import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';

import './Token.css';
import Config from "../components/Configuration";

class Token extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            token: ""
        };

        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    load(reset = false) {
        fetch(Config.apihost + "/api/v2/user/self/token"+(reset ? "/reset" : ""), {
            method: (reset ? 'POST' : 'GET'),
            headers: this.context.defaultHeaders
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                token: res.token
            });
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    onReset() {
        this.load(true);
    }



    render() {
        return (
            <Container fluid>
                <Header />
                <TokenForm token={this.state.token} onReset={this.onReset}/>
            </Container>
        );
    }
}

function TokenForm(props) {
    return (
        <Row className="justify-content-center">
            <Col className="tokenwindow text-center">
                <input type="text" value={props.token} className="text-center w-100" readOnly={true} onClick={(event) => event.target.select()} />
                <button onClick={props.onReset}>Token resetten</button>
            </Col>
        </Row>
    );
}

export default Token;