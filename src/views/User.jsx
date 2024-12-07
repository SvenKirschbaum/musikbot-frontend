import {Component, useMemo} from 'react';
import Container from 'react-bootstrap/Container';
import {Switch, useRouteMatch, withRouter} from "react-router";
import Header from '../components/Header';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'

import './User.css';
import GravatarIMG from "../components/GravatarIMG";
import {TransitionGroup} from "react-transition-group";
import CSSTransition from "react-transition-group/CSSTransition";
import QuickAdd from "../components/QuickAdd";
import Config from "../components/Configuration";
import {withUser} from "../hooks/user";
import {Link, Route} from "react-router-dom";
import {UserStatsDetails} from "./StatsList";
import NoMatch from "../components/NoMatch";
import {AlertContext} from "../context/AlertContext";
import {withDefaultHeaders} from "../hooks/defaultHeaders";

class UserPage extends Component {

    static contextType = AlertContext;

    constructor(props) {
        super(props);
        this.state = {
            user: {
                recent: [],
                mostwished: [],
                mostskipped: [],
                guest: true,
            }
        };

        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load(this.props.match.params.name);
    }

    componentWillUnmount() {
        this.abortController?.abort();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.params.name !== this.props.match.params.name) {
            this.setState({
                user: {
                    recent: [],
                    mostwished: [],
                    mostskipped: [],
                    guest: true,
                }
            });
            this.load(this.props.match.params.name);
        }
    }

    load(username) {
        this.abortController?.abort();
        this.abortController = new AbortController();
        fetch(Config.apihost + "/api/v2/user/" + username, {
            method: 'GET',
            headers: this.props.defaultHeaders,
            signal: this.abortController.signal
        })
            .then((res) => {
                if (!res.ok) throw Error(res.statusText);
                return res;
            })
            .then((res) => res.json())
            .then(value => this.setState({user: value}))
            .catch(reason => {
                this.context.handleException(reason);
            });
    }

    render() {
        return (
            <Container fluid className="h-100 d-flex flex-column">
                <Header />
                <Container fluid className="userpage">
                    <Row>
                        <Col xl={3} xs={12}>
                            <Card className="usercard profilepic">
                                <Card.Body>
                                    <CSSTransition
                                        in={this.state.user.gravatarId !== undefined}
                                        timeout={300}
                                        classNames="fade"
                                        unmountOnExit
                                    >
                                        <GravatarIMG size="250">{this.state.user.gravatarId}</GravatarIMG>
                                    </CSSTransition>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={9} xs={12}>
                            <Row>
                                <Col className="usercardcol">
                                    <Card className="usercard">
                                        <Card.Body>
                                            <Card.Title>Allgemein</Card.Title>
                                            <table>
                                                <tbody>
                                                    <TransitionGroup component={null} exit={false}>
                                                        {(!this.state.user.guest) &&
                                                            <CSSTransition key="id" timeout={300} classNames="fade">
                                                                <tr>
                                                                    <td>ID:</td>
                                                                    <td>{this.state.user.id}</td>
                                                                </tr>
                                                            </CSSTransition>
                                                        }
                                                        <CSSTransition key="username" timeout={300} classNames="fade">
                                                            <tr>
                                                                <td>Username:</td>
                                                                <td>
                                                                    {this.state.user.guest ? "Gast" : this.state.user.name}
                                                                </td>
                                                            </tr>
                                                        </CSSTransition>
                                                        {(!this.state.user.guest) && (this.props.user.admin || (this.state.user.id === this.props.user.id)) &&
                                                        <CSSTransition key="email" timeout={300} classNames="fade">
                                                            <tr>
                                                                <td>Email:</td>
                                                                <td>
                                                                    {this.state.user.email}
                                                                </td>
                                                            </tr>
                                                        </CSSTransition>
                                                        }
                                                        {(!this.state.user.guest) &&
                                                            <CSSTransition key="admin" timeout={300} classNames="fade">
                                                                <tr>
                                                                    <td>Admin:</td>
                                                                    <td>
                                                                        {this.state.user.admin ? "Ja" : "Nein"}
                                                                    </td>
                                                                </tr>
                                                            </CSSTransition>
                                                        }
                                                        <CSSTransition key="wuensche" timeout={300} classNames="fade">
                                                            <tr>
                                                                <td>Wünsche:</td>
                                                                <td>{this.state.user.wuensche}</td>
                                                            </tr>
                                                        </CSSTransition>
                                                        <CSSTransition key="skipped" timeout={300} classNames="fade">
                                                            <tr>
                                                                <td>Davon übersprungen:</td>
                                                                <td>{this.state.user.skipped}</td>
                                                            </tr>
                                                        </CSSTransition>
                                                    </TransitionGroup>
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Card>
                                    <Card className="usercard">
                                        <Card.Body>
                                            <Card.Title>Zuletzt gewünscht:</Card.Title>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Nr.</th>
                                                        <th className="idcolumn"/>
                                                        <th>Titel</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <TransitionGroup component={null} exit={false}>
                                                        {this.state.user.recent.map(
                                                            (entry,key) => (
                                                                <CSSTransition key={key} timeout={300} classNames="fade">
                                                                    <tr key={key}>
                                                                        <td>{entry.id}</td>
                                                                        <td><QuickAdd>{entry.link}</QuickAdd></td>
                                                                        <td><a href={entry.link}>{entry.title}</a></td>
                                                                    </tr>
                                                                </CSSTransition>
                                                            )
                                                        )}
                                                    </TransitionGroup>
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col className="usercardcol">
                                    <Card className="usercard">
                                        <Card.Body>
                                            <Card.Title><Link to={this.props.match.url + "/played"}>Am meisten
                                                gewünscht:</Link></Card.Title>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Nr.</th>
                                                    <th className="idcolumn"/>
                                                    <th>Titel</th>
                                                    <th>Anzahl</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    <TransitionGroup component={null} exit={false}>
                                                        {this.state.user.mostwished.map(
                                                            (entry,key) => (
                                                                <CSSTransition key={key} timeout={300} classNames="fade">
                                                                    <tr key={key}>
                                                                        <td>{key+1}.</td>
                                                                        <td><QuickAdd>{entry.link}</QuickAdd></td>
                                                                        <td><a href={entry.link}>{entry.title}</a></td>
                                                                        <td>{entry.count}</td>
                                                                    </tr>
                                                                </CSSTransition>
                                                            )
                                                        )}
                                                    </TransitionGroup>
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Card>
                                    <Card className="usercard">
                                        <Card.Body>
                                            <Card.Title><Link to={this.props.match.url + "/skipped"}>Am meisten
                                                geskippt:</Link></Card.Title>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Nr.</th>
                                                    <th className="idcolumn"/>
                                                    <th>Titel</th>
                                                    <th>Anzahl</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    <TransitionGroup component={null} exit={false}>
                                                        {this.state.user.mostskipped.map(
                                                            (entry,key) => (
                                                                <CSSTransition key={key} timeout={300} classNames="fade">
                                                                    <tr key={key}>
                                                                        <td>{key+1}.</td>
                                                                        <td><QuickAdd>{entry.link}</QuickAdd></td>
                                                                        <td><a href={entry.link}>{entry.title}</a></td>
                                                                        <td>{entry.count}</td>
                                                                    </tr>
                                                                </CSSTransition>
                                                            )
                                                        )}
                                                    </TransitionGroup>
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Container>
        );
    }
}

function User() {
    const match = useRouteMatch();
    const UserRouteComponent = useMemo(() => withUser(UserPage), []);

    return (
        <Switch>
            <Route path={`${match.path}/`} exact component={UserRouteComponent}/>
            <Route path={`${match.path}/played`}>
                <UserStatsDetails subRoute="played"/>
            </Route>
            <Route path={`${match.path}/skipped`}>
                <UserStatsDetails subRoute="skipped"/>
            </Route>
            <Route component={NoMatch}/>
        </Switch>
    );
}

export default withRouter(withDefaultHeaders(User));