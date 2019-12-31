import React, {Component} from 'react';
import {Container} from 'react-bootstrap';

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';

import './Register.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Config from "../components/Config";

class Register extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);

        this.alert = false;

        this.register = this.register.bind(this);
    }

    register(data) {
        fetch(Config.apihost + "/api/v2/register", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this.context.defaultHeaders
        })
            .then((res) => {
                if(!res.ok) throw Error(res.statusText);
                return res;
            })
            .then((res) => res.json())
            .then((res) => {
                if(res.success) {
                    if(this.alert) this.context.removeAlert(this.alert);
                    this.context.addAlert({
                        id: this.alert,
                        type: 'success',
                        head: 'Die Registrierung wurde erfolgreich abgeschlossen',
                        autoclose: true
                    });
                    this.context.loadToken(res.token);
                }
                else {
                    throw Error(res.error);
                }
            })
            .catch(reason => {
                let delay = 0;
                if(this.alert) {
                    this.context.removeAlert(this.alert);
                    delay = 300;
                }
                this.alert = Math.random().toString(36);
                setTimeout(() => {
                    this.context.addAlert({
                        id: this.alert,
                        type: 'danger',
                        head: 'Die Registrierung konnte nicht abgeschlossen werden',
                        text: reason.message,
                        autoclose: false
                    });
                },delay);
            });
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <RegisterForm onSubmit={this.register} />
            </Container>
        );
    }
}

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state= {
            username: "",
            email: "",
            password: "",
            password2: "",
            terms: false
        };

        this.password2 = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            if(name === "password" || name === "password2") {
                if(this.state.password !== this.state.password2) {
                    this.password2.current.setCustomValidity("Passwörter stimmen nicht überein");
                }
                else {
                    this.password2.current.setCustomValidity("");
                }
            }
        });
    }

    handleSubmit(event) {
        this.props.onSubmit({username: this.state.username,password: this.state.password, email: this.state.email});
        event.preventDefault();
    }

    render() {
        return (
            <Row className="justify-content-center">
                <Col className="registerwindow text-center">
                    <h5>Registrieren</h5>
                    <form onSubmit={this.handleSubmit} autoComplete="off">
                        <label>
                            <span>Username:</span>
                            <input
                                name="username"
                                type="text"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                                required
                                minLength="3"
                                maxLength="30"
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                name="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Passwort:
                            <input
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                minLength="6"
                                required
                            />
                        </label>
                        <label>
                            Passwort wiederholen:
                            <input
                                name="password2"
                                type="password"
                                value={this.state.password2}
                                onChange={this.handleInputChange}
                                ref={this.password2}
                                required
                            />
                        </label>
                        <label>
                            <input
                                name="terms"
                                type="checkbox"
                                value={this.state.terms}
                                onChange={this.handleInputChange}
                                required
                            />
                            <span>Ich habe die <a href="https://datenschutz.elite12.de/">Datenschutzbestimmungen</a> gelesen und akzeptiert</span>
                        </label>
                        <button type="submit">Registrieren</button>
                    </form>
                </Col>
            </Row>
        );
    }
}

export default Register;