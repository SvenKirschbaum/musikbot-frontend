import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, {Component} from "react";
import {withRouter} from "react-router";
import './Header.css';
import Config from './Config';


class Header extends Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        if(this.props.location.pathname !== '/') {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <header>
                <Row>
                    <Col className="Header text-center"><span onClick={this.onClick}>{Config.title2}</span><span onClick={this.onClick}>{Config.title}</span></Col>
                </Row>
            </header>
        );
    }
}

export default withRouter(Header);