import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Link} from "react-router-dom";
import FlipMove from "react-flip-move";
import Moment from 'react-moment';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {Direction, PlayerIcon, Slider} from 'react-player-controls';

import GlobalContext from '../components/GlobalContext';
import GravatarIMG from "../components/GravatarIMG";
import AddSong from "../components/AddSong";
import Header from "../components/Header";
import DragFixedCell from "../components/DragFixedCell";

import './Home.css';
import {FaTrashAlt} from 'react-icons/fa';
import SockJsClient from 'react-stomp';
import ClassWrapper from "../components/ClassWrapper";

class Home extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            status: 'Loading...',
            songtitle: 'Loading...',
            songlink: null,
            playlistdauer: 0,
            playlist: [],
            volume: 38
        };

        this.statebuffer = null;
        this.isdragging = false;
        this.clientRef = null;

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
        this.parseUpdate = this.parseUpdate.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.onVolume = this.onVolume.bind(this);
    }

    parseUpdate(response) {
        if (this.isdragging) {
            this.statebuffer = response;
        } else {
            this.setState(response);
        }
    }

    sendStart() {
        fetch("/api/control/start", {
            method: 'POST',
            headers: this.context.defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.context.handleException(reason);
            })
    }

    sendPause() {
        fetch("/api/control/pause", {
            method: 'POST',
            headers: this.context.defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.context.handleException(reason);
            })
    }

    sendStop() {
        fetch("/api/control/stop", {
            method: 'POST',
            headers: this.context.defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.context.handleException(reason);
            })
    }

    sendSkip() {
        fetch("/api/control/skip", {
            method: 'POST',
            headers: this.context.defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.context.handleException(reason);
            })
    }

    sendShuffle() {
        fetch("/api/control/shuffle", {
            method: 'POST',
            headers: this.context.defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.context.handleException(reason);
            })
    }

    sendDelete(id, lock) {
        fetch("/api/v2/songs/" + id + (lock ? "?lock=true" : ""), {
            method: 'DELETE',
            headers: this.context.defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                this.context.handleException(reason);
            })
    }

    sendSong(url) {
        let headers = new Headers(this.context.defaultHeaders);
        headers.set("Content-Type", "text/plain");
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
                this.context.addAlert({
                    id: Math.random().toString(36),
                    type: type,
                    text: res.message,
                    autoclose: true
                });
            })
            .catch(reason => {
                this.context.handleException(reason);
            })
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
        let headers = new Headers(this.context.defaultHeaders);
        headers.set("Content-Type", "text/plain");
        fetch("/api/v2/songs/" + id, {
            method: 'PUT',
            headers: headers,
            body: prev
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);

        })
        .catch(reason => {
            this.context.handleException(reason);
        })
    }

    setVolume(volume) {
        this.setState({volume : volume*100});
    }

    onVolume(volume) {
        if(volume == null) return;

        let headers = new Headers(this.context.defaultHeaders);
        headers.set("Content-Type", "application/json");
        fetch("/api/control/volume", {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                'volume': volume*100
            })
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
        .catch(reason => {
            this.context.handleException(reason);
        })
    }

    render() {
        return (
            <Container fluid>
                <Header/>
                <main>
                    <Status state={this.state.status} title={this.state.songtitle} link={this.state.songlink}
                            duration={this.state.playlistdauer}/>
                    {this.context.user && this.context.user.admin &&
                    <ControlElements onStart={this.sendStart} onPause={this.sendPause} onStop={this.sendStop}
                                     onSkip={this.sendSkip} />}
                    <Playlist onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} AuthState={this.context}
                              onDelete={this.sendDelete} songs={this.state.playlist}/>
                    <BottomControl onShuffle={this.sendShuffle} setVolume={this.setVolume} onVolume={this.onVolume} volume={this.state.volume} admin={this.context.user && this.context.user.admin}/>
                    <AddSong handlefetchError={this.context.handleException} sendSong={this.sendSong} buttontext="Abschicken"/>
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
                            <table className="mb-table col-xl-9 col-lg-10 col-md-11 col-11"
                                   ref={provided.innerRef} {...provided.droppableProps}>
                                <thead>
                                <tr className="header">
                                    <th className="d-none d-sm-table-cell songid">Song ID</th>
                                    <th className="d-none d-lg-table-cell insertat">Eingefügt am</th>
                                    <th className="d-none d-sm-table-cell author">Eingefügt von</th>
                                    <th className="songtitle">Titel</th>
                                    <th className="d-none d-md-table-cell songlink">Link</th>
                                    {props.AuthState.user && props.AuthState.user.admin && <th className="delete"/>}
                                </tr>
                                </thead>
                                <FlipMove typeName="tbody" enterAnimation="fade" leaveAnimation="none" duration={400}>
                                    {props.songs.map((song, index) => {
                                        return (
                                            //This wrapper is required, because Draggable is a functional Component since version 11 of react-beautiful-dnd, and functional components can not be used as childs of FlipMove
                                            <ClassWrapper key={song.id}>
                                                <Draggable
                                                    isDragDisabled={!(props.AuthState.user && props.AuthState.user.admin)}
                                                    key={song.id} draggableId={song.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Song AuthState={props.AuthState} onDelete={props.onDelete}
                                                              key={song.id} {...song} provided={provided}
                                                              isDragging={snapshot.isDragging}/>
                                                    )}
                                                </Draggable>
                                            </ClassWrapper>
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
                to={`/user/${props.authorLink}`}>{props.author}</Link></DragFixedCell>
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

class VolumeControl extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isDragging: false
        };

        this.onChange = this.onChange.bind(this);
        this.onChangeStart = this.onChangeStart.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
    }

    onChange(volume) {
        this.props.setVolume(volume);
    }

    onChangeStart(volume) {
        this.setState({
            isDragging: true
        });
    }

    onChangeEnd(volume) {
        this.setState({
            isDragging: false
        });
        this.props.onVolume(volume);
    }

    render() {
        return (
            <div className="volume-slider-container">
                <PlayerIcon.SoundOn className="volume-slider-icon"/>
                <div className="volume-slider-block">
                    <Slider
                        direction={Direction.HORIZONTAL}
                        isEnabled
                        onChange={this.onChange}
                        onChangeStart={this.onChangeStart}
                        onChangeEnd={this.onChangeEnd}
                        className={this.state.isDragging ? "volume-slider active" : "volume-slider"}
                    >
                        <div
                            className="volume-slider-bar"
                            style={{
                                width: `${this.props.volume}%`,
                            }}
                        />
                        <div
                            className="volume-slider-handle"
                            style={{
                                left: `${this.props.volume}%`,
                            }}
                        />
                    </Slider>
                </div>
            </div>
        );
    }
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
                                <Row noGutters={true}>
                                    <VolumeControl onVolume={props.onVolume} setVolume={props.setVolume} volume={props.volume} />
                                    <Button onClick={props.onShuffle}>Shuffle</Button>
                                </Row>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
}

export default Home;