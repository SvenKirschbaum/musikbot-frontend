import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Link} from "react-router-dom";
import FlipMove from "react-flip-move";
import Moment from 'react-moment';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import AuthenticationContext from '../components/AuthenticationContext';
import GravatarIMG from "../components/GravatarIMG";
import AddSong from "../components/AddSong";
import Header from "../components/Header";
import Alerts from "../components/Alerts";
import DragFixedCell from "../components/DragFixedCell";

import './Home.css';
import {FaTrashAlt} from 'react-icons/fa';
import SockJsClient from 'react-stomp';

class Home extends Component {

    static contextType = AuthenticationContext;

    constructor(props) {
        super(props);
        this.state = {
            status: 'Loading...',
            songtitle: 'Loading...',
            songlink: null,
            playlistdauer: 0,
            playlist: [],
            alerts: []
        };

        this.statebuffer = null;
        this.isdragging = false;
        this.clientRef = null;

        this.addAlert = this.addAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.sendStart = this.sendStart.bind(this);
        this.sendPause = this.sendPause.bind(this);
        this.sendStop = this.sendStop.bind(this);
        this.sendSkip = this.sendSkip.bind(this);
        this.sendShuffle = this.sendShuffle.bind(this);
        this.sendDelete = this.sendDelete.bind(this);
        this.sendSong = this.sendSong.bind(this);
        this.sendSort = this.sendSort.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.handlefetchError = this.handlefetchError.bind(this);
        this.parseUpdate = this.parseUpdate.bind(this);
    }

    parseUpdate(response) {
        if (this.isdragging) {
            this.statebuffer = response;
        } else {
            this.setState(response);
        }
    }

    addAlert(alert) {
        var alerts = [...this.state.alerts];
        alerts.push(alert);
        this.setState({alerts: alerts});
    }

    removeAlert(id) {
        var alerts = [...this.state.alerts]; // make a separate copy of the array
        let index = -1;
        for (const [key, value] of Object.entries(alerts)) {
            if (value.id === id) {
                index = key;
            }
        }
        if (index !== -1) {
            alerts.splice(index, 1);
            this.setState({alerts: alerts});
        }
    }

    sendStart() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/control/start", {
            method: 'POST',
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.handlefetchError(reason);
            })
    }

    sendPause() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/control/pause", {
            method: 'POST',
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.handlefetchError(reason);
            })
    }

    sendStop() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/control/stop", {
            method: 'POST',
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.handlefetchError(reason);
            })
    }

    sendSkip() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/control/skip", {
            method: 'POST',
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.handlefetchError(reason);
            })
    }

    sendShuffle() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/control/shuffle", {
            method: 'POST',
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.handlefetchError(reason);
            })
    }

    sendDelete(id, lock) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/v2/songs/" + id + (lock ? "?lock=true" : ""), {
            method: 'DELETE',
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.handlefetchError(reason);
            })
    }

    sendSong(url) {
        let headers = new Headers();
        headers.append("Content-Type", "text/plain");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/v2/songs", {
            method: 'POST',
            body: url,
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        })
            .then((res) => res.json())
            .then((res) => {
                let type = res.success ? 'success' : 'danger';
                if (res.warn && res.success) type = 'warning';
                this.addAlert({
                    id: Math.random().toString(36),
                    type: type,
                    text: res.message,
                    autoclose: true
                });
            })
            .catch(reason => {
                this.handlefetchError(reason);
            })
    }

    handlefetchError(e) {
        this.addAlert({
            id: Math.random().toString(36),
            type: 'danger',
            head: 'Es ist ein Fehler aufgetreten',
            text: e.message,
            autoclose: false
        });
    }

    onDragStart(start, provided) {
        this.isdragging = true;
    }

    onDragEnd(result) {
        this.isdragging = false;
        if (this.statebuffer !== null) {
            this.setState(this.statebuffer);
            this.statebuffer = null;
        }


        const {destination, source} = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newList = Array.from(this.state.playlist);
        newList.splice(source.index, 1);
        newList.splice(destination.index, 0, this.state.playlist[source.index]);

        this.setState({
            playlist: newList
        }, () => this.statebuffer = null);

        const prev = (destination.index - 1) >= 0 ? newList[destination.index - 1].id : -1;
        const id = newList[destination.index].id;

        this.sendSort(prev, id);

    }

    sendSort(prev, id) {
        let headers = new Headers();
        headers.append("Content-Type", "text/plain");
        if (this.context.token) headers.append("Authorization", "Bearer " + this.context.token);
        fetch("/api/v2/songs/" + id, {
            method: 'PUT',
            headers: headers,
            body: prev
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);

        })
        .catch(reason => {
            this.handlefetchError(reason);
        })
    }

    render() {
        return (
            <Container fluid>
                <Alerts onClose={this.removeAlert}>{this.state.alerts}</Alerts>
                <Header/>
                <main>
                    <Status state={this.state.status} title={this.state.songtitle} link={this.state.songlink}
                            duration={this.state.playlistdauer}/>
                    {this.context.user && this.context.user.admin &&
                    <ControlElements onStart={this.sendStart} onPause={this.sendPause} onStop={this.sendStop}
                                     onSkip={this.sendSkip}/>}
                    <Playlist onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} AuthState={this.context}
                              onDelete={this.sendDelete} songs={this.state.playlist}/>
                    <BottomControl onShuffle={this.sendShuffle} admin={this.context.user && this.context.user.admin}/>
                    <AddSong handlefetchError={this.handlefetchError} sendSong={this.sendSong} buttontext="Abschicken"/>
                </main>
                <SockJsClient
                    url={`/api/sock`}
                    topics={['/user/queue/state','/topic/state']}
                    onMessage={(message) => this.parseUpdate(message)}
                    onConnect={() => this.clientRef.sendMessage("/app/state")}
                    ref={(client) => { this.clientRef = client }}
                />
            </Container>
        );
    }
}

function Playlist(props) {
    return (
        <section>
            <Row className="space-top justify-content-center">
                <DragDropContext
                    onDragStart={props.onDragStart}
                    onDragEnd={props.onDragEnd}
                >
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <table className="playlist col-xl-9 col-lg-10 col-md-11 col-11"
                                   ref={provided.innerRef} {...provided.droppableProps}>
                                <thead>
                                <tr className="header">
                                    <th className="d-none d-sm-table-cell songid">Song ID</th>
                                    <th className="d-none d-lg-table-cell insertat">Eingefügt am</th>
                                    <th className="d-none d-sm-table-cell author">Eingefügt von</th>
                                    <th className="songtitle">Titel</th>
                                    <th className="d-none d-md-table-cell songlink">Link</th>
                                    {props.AuthState.user && props.AuthState.user.admin && <th className="delete"></th>}
                                </tr>
                                </thead>
                                <FlipMove typeName="tbody" enterAnimation="fade" leaveAnimation="none" duration={400}>
                                    {props.songs.map((song, index) => {
                                        return (
                                            <Draggable
                                                isDragDisabled={!(props.AuthState.user && props.AuthState.user.admin)}
                                                key={song.id} draggableId={song.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <Song AuthState={props.AuthState} onDelete={props.onDelete}
                                                          key={song.id} {...song} provided={provided}
                                                          isDragging={snapshot.isDragging}/>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </FlipMove>
                            </table>
                        )}
                    </Droppable>
                </DragDropContext>
            </Row>
        </section>
    );
}

function Song(props) {
    return (
        <tr className={props.isDragging ? "song dragging" : "song"} {...props.provided.draggableProps}
            ref={props.provided.innerRef}>
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-sm-table-cell"
                           addToElem={props.provided.dragHandleProps}>{props.id}</DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-lg-table-cell"><Moment
                format="DD.MM.YYYY - HH:mm:ss">{props.insertedAt}</Moment></DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging}
                           className="d-none d-sm-inline-flex author"><span><GravatarIMG>{props.gravatarId}</GravatarIMG></span><Link
                to={`/users/${props.authorLink}`}>{props.author}</Link></DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging} className="nolink songtitle"><a
                href={props.link}>{props.title}</a></DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-md-table-cell songlink"><a
                href={props.link}>{props.link}</a></DragFixedCell>
            {props.AuthState.user && props.AuthState.user.admin &&
            <DragFixedCell isDragOccurring={props.isDragging} className="d-inline-flex deleteicon" onClick={(e) => {
                props.onDelete(props.id, e.shiftKey)
            }}><FaTrashAlt/></DragFixedCell>}
        </tr>
    );
}

function Status(props) {
    return (
        <section>
            <Row className="justify-content-center">
                <Col className="Status" xl={{span: 5}} md={{span: 8}} xs={{span: 10}}>
                    <Row>
                        <Col>{props.state}</Col>
                        <Col className="text-right" xs="auto"><span className="d-none d-lg-inline">Die Aktuelle Playlist umfasst </span>{props.duration} Minuten<span
                            className="d-none d-lg-inline"> Musik!</span></Col>
                    </Row>
                    <Row>
                        <Col>{(props.link) ? <a href={props.link}>{props.title}</a> : props.title}</Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
}

function ControlElements(props) {
    return (
        <section>
            <Row className="justify-content-center">
                <Col className="Control" xl={{span: 5}} md={{span: 8}} xs={{span: 10}}>
                    <Row noGutters={false}>
                        <Col><Button onClick={props.onStart}>Start</Button></Col>
                        <Col><Button onClick={props.onPause}>Pause</Button></Col>
                        <Col><Button onClick={props.onStop}>Stop</Button></Col>
                        <Col><Button onClick={props.onSkip}>Skip</Button></Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
}

function BottomControl(props) {
    return (
        <section>
            <Row className="justify-content-center">
                <Col className="BottomControl" xl={{span: 9}} lg={{span: 10}} md={{span: 11}} xs={{span: 11}}>
                    <Row noGutters={false}>
                        <Col xs={{span: 6}}><Link to="/archiv">Zum Archiv</Link></Col>
                        <Col xs={{span: 6}}>
                            {props.admin &&
                                <Button onClick={props.onShuffle}>Shuffle</Button>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
}

export default Home;