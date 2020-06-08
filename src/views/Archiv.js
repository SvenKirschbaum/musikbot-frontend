import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Link} from "react-router-dom";
import {TransitionGroup} from "react-transition-group";
import CSSTransition from "react-transition-group/CSSTransition";
import Moment from 'react-moment';
import {withRouter} from "react-router";

import Row from 'react-bootstrap/Row';
import Pagination from "react-js-pagination";

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';
import GravatarIMG from "../components/GravatarIMG";
import Config from "../components/Configuration";

import './Archiv.css';
import QuickAdd from "../components/QuickAdd";

class Archiv extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            page: 1,
            pages: 1,
        };

        this.abortController = new AbortController();

        this.change = this.change.bind(this);
    }

    componentDidMount() {
        this.load((this.props.match.params.page === undefined ? 1 : this.props.match.params.page));
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    load(page) {
        this.abortController.abort();
        this.abortController = new AbortController();
        fetch(Config.apihost + "/api/v2/archiv/"+page, {
            method: 'GET',
            headers: this.context.defaultHeaders,
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
        this.props.history.push('/archiv/'+(page));
        this.load(page);
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <Archivlist songs={this.state.list} />
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

function Archivlist(props) {
    return (
        <Row className="justify-content-center">
            <table className="mb-table col-xl-9 col-lg-10 col-md-12 lr-space archiv">
                <thead>
                    <tr className="header">
                        <th className="d-none d-sm-table-cell songid">Song ID</th>
                        <th className="insertat">Gespielt um</th>
                        <th className="d-none d-sm-table-cell author">Eingefügt von</th>
                        <td className="d-none d-sm-table-cell"></td>
                        <th className="songtitle">Titel</th>
                        <th className="d-none d-md-table-cell songlink">Link</th>
                    </tr>
                </thead>
                    <tbody>
                        <TransitionGroup component={null} exit={false}>
                            {props.songs.map((song) => (
                                <CSSTransition key={song.id} timeout={300} classNames="song-anim">
                                    <Song key={song.id} {...song} />
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </tbody>
            </table>
        </Row>
    );
}

function Song(props) {
    let className = "song";
    if(props.skipped) {
        className += " song-skipped";
    }
    return (
        <tr className={className}>
            <td className="d-none d-sm-table-cell">{ props.id }</td>
            <td className=""><span className="d-none d-sm-inline"><Moment format="DD.MM.YYYY">{ props.playedAt }</Moment> - </span><Moment format="HH:mm:ss">{ props.playedAt }</Moment></td>
            <td className="d-none d-sm-inline-flex author"><GravatarIMG>{ props.gravatarId }</GravatarIMG>{Config.enableusers ? <Link to={`/user/${props.authorLink}`}>{ props.author }</Link> : props.author}</td>
            <td className="d-none d-sm-table-cell"><QuickAdd>{props.link}</QuickAdd></td>
            <td className="nolink songtitle"><a href={ props.link }>{ props.title }</a></td>
            <td className="d-none d-md-table-cell songlink"><a href={props.link}>{ props.link }</a></td>
        </tr>
    );
}

export default withRouter(Archiv);