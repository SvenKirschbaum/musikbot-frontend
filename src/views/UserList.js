import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {withRouter} from "react-router";

import Row from 'react-bootstrap/Row';
import Pagination from "react-js-pagination";

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';

import './UserList.css';
import {TransitionGroup} from "react-transition-group";
import CSSTransition from "react-transition-group/CSSTransition";
import GravatarIMG from "../components/GravatarIMG";
import {Link} from "react-router-dom";
import Config from "../components/Config";

class UserList extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            page: 1,
            pages: 1,
        };

        this.change = this.change.bind(this);
    }

    componentDidMount() {
        this.load((this.props.match.params.page === undefined ? 1 : this.props.match.params.page));
    }

    load(page) {
        fetch(Config.apihost + "/api/v2/users/"+page, {
            method: 'GET',
            headers: this.context.defaultHeaders
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
        this.props.history.push('/users/'+(page));
        this.load(page);
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <List data={this.state.list} />
                <Row className="justify-content-center archivepager">
                    <Pagination
                        activePage={this.state.page}
                        itemsCountPerPage={25}
                        totalItemsCount={25*this.state.pages}
                        pageRangeDisplayed={5}
                        onChange={this.change}
                        itemClass="page-item"
                        linkClass="page-link"
                        firstPageText="First"
                        lastPageText="Last"
                        hideNavigation={true}
                    />
                </Row>
            </Container>
        );
    }
}

function List(props) {
    return (
        <Row className="justify-content-center">
            <table className="mb-table col-xl-4 col-lg-6 col-md-8 lr-space text-left">
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
                        <CSSTransition key={user.id} timeout={300} classNames="song-anim">
                            <User key={user.id} {...user} />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                </tbody>
            </table>
        </Row>
    );
}

function User(props) {
    return (
        <tr>
            <td className="text-center">{ props.id }</td>
            <td className=""><GravatarIMG>{ props.gravatarId }</GravatarIMG><Link to={`/user/${props.name}`}>{ props.name }</Link></td>
            <td className="d-none d-sm-table-cell">{ props.email }</td>
            <td className="">{ props.admin ? "Ja" : "Nein" }</td>
        </tr>
    );
}

export default withRouter(UserList);