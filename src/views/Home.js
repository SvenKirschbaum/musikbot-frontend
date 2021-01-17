import {Component, useContext, useRef, useState} from 'react';
import Container from 'react-bootstrap/Container';
import {Link} from "react-router-dom";
import FlipMove from "react-flip-move";
import Moment from 'react-moment';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {Direction, PlayerIcon, Slider} from 'react-player-controls';
import GravatarIMG from "../components/GravatarIMG";
import AddSong from "../components/AddSong";
import Header from "../components/Header";
import DragFixedCell from "../components/DragFixedCell";
import Config from "../components/Configuration";

import './Home.css';
import {FaTrashAlt} from 'react-icons/fa';
import ClassWrapper from "../components/ClassWrapper";
import SongProgress from "../components/SongProgress";
import {getDefaultHeaders} from "../hooks/defaultHeaders";
import useUser, {withUser} from "../hooks/user";
import {AlertContext} from "../context/AlertContext";
import withDropSong from "../components/withDropSong";
import {useSubscription} from "react-stomp-hooks";

const HomeContainer = withDropSong(Container);

function Home(props) {

    const alertContext = useContext(AlertContext);

    const [state, setState] = useState({
        status: 'Loading...',
        songtitle: null,
        songlink: null,
        playlistdauer: 0,
        playlist: [],
        volume: undefined
    });

    const statebuffer = useRef(null);
    const isdragging = useRef(false);

    const parseUpdate = (message) => {
        const content = JSON.parse(message.body);
        if (isdragging.current) {
            statebuffer.current = content;
        } else {
            setState(content);
        }
    }

    useSubscription(["/topic/state", "/musikbot/state"], parseUpdate)

    const sendStart = () => {
        fetch(Config.apihost + "/api/control/start", {
            method: 'POST',
            headers: getDefaultHeaders()
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const sendPause = () => {
        fetch(Config.apihost + "/api/control/pause", {
            method: 'POST',
            headers: getDefaultHeaders()
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const sendStop = () => {
        fetch(Config.apihost + "/api/control/stop", {
            method: 'POST',
            headers: getDefaultHeaders()
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const sendSkip = () => {
        fetch(Config.apihost + "/api/control/skip", {
            method: 'POST',
            headers: getDefaultHeaders()
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const sendShuffle = () => {
        fetch(Config.apihost + "/api/control/shuffle", {
            method: 'POST',
            headers: getDefaultHeaders()
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const sendDelete = (id, lock) => {
        fetch(Config.apihost + "/api/v2/songs/" + id + (lock ? "?lock=true" : ""), {
            method: 'DELETE',
            headers: getDefaultHeaders()
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const sendSong = (url) => {
        let headers = getDefaultHeaders();
        headers.set("Content-Type", "text/plain");
        fetch(Config.apihost + "/api/v2/songs", {
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
                alertContext.addAlert({
                    id: Math.random().toString(36),
                    type: type,
                    text: res.message,
                    autoclose: true
                });
            })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const onDragStart = (_start, _provided) => {
        isdragging.current = true;
    }

    const onDragEnd = (result) => {
        isdragging.current = false;
        if (statebuffer.current !== null) {
            setState(statebuffer.current);
            statebuffer.current = null;
        }


        const {destination, source} = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newList = Array.from(state.playlist);
        newList.splice(source.index, 1);
        newList.splice(destination.index, 0, state.playlist[source.index]);

        const newState = Object.assign({}, state, {playlist: newList});
        statebuffer.current = null
        setState(newState);

        const prev = (destination.index - 1) >= 0 ? newList[destination.index - 1].id : -1;
        const id = newList[destination.index].id;

        sendSort(prev, id);

    }

    const sendSort = (prev, id) => {
        let headers = getDefaultHeaders();
        headers.set("Content-Type", "text/plain");
        fetch(Config.apihost + "/api/v2/songs/" + id, {
            method: 'PUT',
            headers: headers,
            body: prev
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const setVolume = (volume) => {
        setState(Object.assign({}, state, {volume: volume * 100}));
    }

    const onVolume = (volume) => {
        if (volume == null) return;

        let headers = getDefaultHeaders();
        headers.set("Content-Type", "application/json");
        fetch(Config.apihost + "/api/control/volume", {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                'volume': volume * 100
            })
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    return (
        <HomeContainer
            fluid
            className={"homeContainer"}
            sendSong={sendSong}
        >
            <Header/>
            <main>
                <Status state={state.status} title={state.songtitle} link={state.songlink}
                        duration={state.playlistdauer} progress={state.progress}/>
                {props.user && props.user.admin &&
                <ControlElements onStart={sendStart} onPause={sendPause} onStop={sendStop}
                                 onSkip={sendSkip}/>}
                <Playlist onDragStart={onDragStart} onDragEnd={onDragEnd}
                          onDelete={sendDelete} songs={state.playlist}/>
                <BottomControl onShuffle={sendShuffle} setVolume={setVolume} onVolume={onVolume}
                               volume={state.volume} admin={props.user && props.user.admin}/>
                <AddSong handlefetchError={alertContext.handleException} sendSong={sendSong}
                         buttontext="Abschicken"/>
            </main>
        </HomeContainer>
    );
}

function Playlist(props) {

    const user = useUser();

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
                                    {user && user.admin && <th className="delete"/>}
                                </tr>
                                </thead>
                                <FlipMove typeName="tbody" enterAnimation="fade" leaveAnimation="none" duration={400}>
                                    {props.songs.map((song, index) => {
                                        return (
                                            //This wrapper is required, because Draggable is a functional Component since version 11 of react-beautiful-dnd, and functional components can not be used as childs of FlipMove
                                            <ClassWrapper key={song.id}>
                                                <Draggable
                                                    isDragDisabled={!(user && user.admin)}
                                                    key={song.id} draggableId={song.id.toString()} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Song onDelete={props.onDelete}
                                                              key={song.id} {...song} provided={provided}
                                                              isDragging={snapshot.isDragging}
                                                              user={user}
                                                        />
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
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-sm-inline-flex author">
                <span>
                    <GravatarIMG>{props.gravatarId}</GravatarIMG>
                </span>
                {Config.enableusers && props.authorLink ?
                    <Link to={`/user/${props.authorLink}`}>{props.author}</Link>
                    :
                    props.author
                }
            </DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging} className="nolink songtitle"><a
                href={props.link}>{props.title}</a></DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-md-table-cell songlink"><a
                href={props.link}>{props.link}</a></DragFixedCell>
            {props.user && props.user.admin &&
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
                    {props.progress && <SongProgress>{props.progress}</SongProgress>}
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

    onChangeStart(_volume) {
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
            <div className="d-none d-sm-inline volume-slider-container">
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
                        <Col xs={{span: 6}}>{Config.showarchive && <Link to="/archiv">Zum Archiv</Link>}</Col>
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

export default withUser(Home);