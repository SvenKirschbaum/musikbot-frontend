import {Component} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Header from '../components/Header';
import CustomPagination from '../components/CustomPagination';

import './UserList.css';
import {TransitionGroup} from "react-transition-group";
import GravatarIMG from "../components/GravatarIMG";
import {Link, useNavigate} from "react-router-dom";
import Config from "../components/Configuration";
import {AlertContext} from "../context/AlertContext";
import {withDefaultHeaders} from "../hooks/defaultHeaders";
import CSSTransitionWithRef from "../components/CSSTransitionWithRef.jsx";
import {useMatch} from "react-router";

class UserList extends Component {

    static contextType = AlertContext;

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            page: 1,
            pages: 1,
        };

        this.change = this.change.bind(this);
    }

    componentWillUnmount() {
        this.abortController?.abort();
    }

    componentDidMount() {
        console.log(this.props)
        this.load((this.props.match.params.page === undefined ? 1 : this.props.match.params.page));
    }

    load(page) {
        this.abortController?.abort();
        this.abortController = new AbortController();
        fetch(Config.apihost + "/api/v2/users/"+page, {
            method: 'GET',
            headers: this.props.defaultHeaders,
            signal: this.abortController.signal
        })
            .then((res) => {
                if(!res.ok) throw Error(res.statusText);
                return res;
            })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    page: res.page,
                    pages: res.pages,
                    list: res.list
                });
            })
            .catch(reason => {
                this.context.handleException(reason);
            });
    }

    change(page) {
        this.props.navigate('/users/' + (page));
        this.load(page);
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <List data={this.state.list} />
                <Row className="justify-content-center archivepager">
                    <CustomPagination
                        activePage={this.state.page}
                        pages={this.state.pages}
                        onChange={this.change}
                    />
                </Row>
            </Container>
        );
    }
}

function List(props) {
    return (
        <Row className="justify-content-center">
            <table className="mb-table col-xl-4 col-lg-6 col-md-8 lr-space text-start">
                <thead>
                <tr className="header">
                    <th className="text-center">ID</th>
                    <th className="">Name</th>
                    <th className="d-none d-sm-table-cell">Email</th>
                    <th className="">Admin</th>
                </tr>
                </thead>
                <tbody>
                <TransitionGroup component={null} exit={false}>
                    {props.data.map((user) => (
                        <CSSTransitionWithRef key={user.id} timeout={300} classNames="song-anim">
                            <User key={user.id} {...user} />
                        </CSSTransitionWithRef>
                    ))}
                </TransitionGroup>
                </tbody>
            </table>
        </Row>
    );
}

function User(props) {
    return (
        <tr ref={props.ref}>
            <td className="text-center">{ props.id }</td>
            <td className=""><GravatarIMG>{ props.gravatarId }</GravatarIMG><Link to={`/user/${props.name}`}>{ props.name }</Link></td>
            <td className="d-none d-sm-table-cell">{ props.email }</td>
            <td className="">{ props.admin ? "Ja" : "Nein" }</td>
        </tr>
    );
}

export default withDefaultHeaders((props) => {
    const navigate = useNavigate();
    const match = useMatch("/users/:page?");

    return <UserList navigate={navigate} match={match} {...props}></UserList>;
});