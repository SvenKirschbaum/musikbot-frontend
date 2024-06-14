import {useContext, useMemo, useRef, useState} from 'react';
import Container from 'react-bootstrap/Container';
import {Link} from "react-router-dom";
import FlipMove from "react-flip-move";
import Moment from 'react-moment';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import GravatarIMG from "../components/GravatarIMG";
import AddSong from "../components/AddSong";
import Header from "../components/Header";
import DragFixedCell from "../components/DragFixedCell";
import Config from "../components/Configuration";
import VolumeControl from "../components/VolumeControl";

import './Home.css';
import {FaTrashAlt} from 'react-icons/fa';
import ClassWrapper from "../components/ClassWrapper";
import SongProgress from "../components/SongProgress";
import useUser, {withUser} from "../hooks/user";
import {AlertContext} from "../context/AlertContext";
import withDropSong from "../components/withDropSong";
import {useSubscription} from "react-stomp-hooks";
import moment from "moment/min/moment-with-locales";
import useDefaultHeaders from "../hooks/defaultHeaders";

const HomeContainer = withDropSong(Container);

function Home(props) {

    const alertContext = useContext(AlertContext);
    const defaultHeaders = useDefaultHeaders();

    const [state, setState] = useState({
        status: 'Loading...',
        songtitle: null,
        songlink: null,
        playlistdauer: 0,
        playlist: [],
        preview: [],
        volume: 50
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
            headers: defaultHeaders
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
            headers: defaultHeaders
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
            headers: defaultHeaders
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
            headers: defaultHeaders
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
            headers: defaultHeaders
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
            headers: defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const sendSong = (url) => {
        let headers = defaultHeaders
        headers.set("Content-Type", "text/plain");

        const guestToken = sessionStorage.getItem('guestToken');
        if (guestToken) headers.set("X-Guest-Token", guestToken);

        fetch(Config.apihost + "/api/v2/songs", {
            method: 'POST',
            body: url,
            headers: headers
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(res => {
            const responseGuestToken = res.headers.get("X-Guest-Token");
            if (responseGuestToken) {
                sessionStorage.setItem('guestToken', responseGuestToken);
            }
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

    const onBeforeDragStart = (_start, _provided) => {
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

        const id = newList[destination.index].id;
        const prevSort = (destination.index - 1) >= 0 ? newList[destination.index - 1].sort : 0;
        const nextSort = (destination.index + 1) < newList.length ? newList[destination.index + 1].sort : (prevSort + 200);
        const newSort = (prevSort + nextSort) / 2

        newList[destination.index].sort = newSort;

        const newState = Object.assign({}, state, {playlist: newList});
        statebuffer.current = null
        setState(newState);

        sendSort(id, newSort);
    }

    const sendSort = (id, newSort) => {
        let headers = defaultHeaders
        headers.set("Content-Type", "application/json");
        fetch(Config.apihost + "/api/v2/songs/" + id, {
            method: 'PUT',
            headers: headers,
            body: newSort
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
        })
            .catch(reason => {
                alertContext.handleException(reason);
            })
    }

    const setVolume = (volume) => {
        setState(Object.assign({}, state, {volume: volume}));
    }

    const onVolume = (volume) => {
        if (volume == null) return;

        let headers = defaultHeaders
        headers.set("Content-Type", "application/json");
        fetch(Config.apihost + "/api/control/volume", {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                'volume': volume
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
                <Playlist state={state} onBeforeDragStart={onBeforeDragStart} onDragEnd={onDragEnd}
                          onDelete={sendDelete} songs={state.playlist} preview={state.preview}/>
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

    const startOffset = useMemo(() => {
        //Add the sum of the duration of all previous songs to each song
        let sum = moment.duration(100, "milliseconds");

        if (props.state.progress) {
            sum.add(moment.duration(props.state.progress.duration, 'seconds'))
            sum.subtract(moment.duration(props.state.progress.prepausedDuration));

            if (!props.state.progress.paused) {
                sum.subtract(moment.duration(moment(props.state.progress.current).diff(moment(props.state.progress.start))));
            }
        }
        return sum;
    }, [props.state.progress?.paused, props.state.progress?.current, props.state.progress?.start, props.state.progress?.duration, props.state.progress?.prepausedDuration]);

    const calculateStartOffset = (songs, startOffset) => {
        const sum = startOffset.clone();
        const playing = props.state.progress && !props.state.progress.paused

        return songs.map((song) => {
            const newSong = {
                ...song,
                startTime: playing ? moment().add(sum) : sum.clone()
            };

            sum.add(moment.duration(song.duration, "seconds"));

            return newSong;
        });
    }

    const enhancedSongs = useMemo(() => calculateStartOffset(props.songs, startOffset), [props.state.progress?.paused, props.songs, startOffset]);
    const playlistDuration = useMemo(() => props.songs.reduce((acc, song) => acc + song.duration, 0), [props.songs]);
    const enhancedPreview = useMemo(() => calculateStartOffset(props.preview, startOffset.clone().add(moment.duration(playlistDuration, "seconds"))), [props.state.progress?.paused, props.songs, props.preview, startOffset]);

    return (
        <section>
            <Row className="space-top justify-content-center">
                <DragDropContext
                    onBeforeDragStart={props.onBeforeDragStart}
                    onDragEnd={props.onDragEnd}
                >
                    <table className="mb-table col-xl-9 col-lg-10 col-md-11 col-11">
                        <thead>
                        <tr className="header">
                            <th className="d-none d-sm-table-cell songid">Song ID</th>
                            <th className="d-none d-sm-table-cell datetime">Startzeit</th>
                            <th className="d-none d-sm-table-cell author">Eingefügt von</th>
                            <th className="songtitle">Titel</th>
                            <th className="d-none d-md-table-cell songlink">Link</th>
                            {user && user.admin && <th className="delete"/>}
                        </tr>
                        </thead>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                                <FlipMove typeName={null} enterAnimation="fade" leaveAnimation="none" duration={400}>
                                    {enhancedSongs.map((song, index) => {
                                        return (
                                            //This wrapper is required, because Draggable is a functional Component since version 11 of react-beautiful-dnd, and functional components can not be used as childs of FlipMove
                                            <ClassWrapper key={song.id}>
                                                <Draggable
                                                    isDragDisabled={!(user && user.admin) || song.preview}
                                                    key={song.id} draggableId={song.id?.toString()} index={index}>
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
                                </tbody>
                            )}
                        </Droppable>
                        <FlipMove className={"preview"} typeName={"tbody"} enterAnimation="fade" leaveAnimation="none"
                                  duration={400}>
                            {enhancedPreview.map((song, index) => {
                                return (
                                    <ClassWrapper key={song.link}>
                                        <Song preview={true}
                                              key={song.link}
                                              {...song}
                                              user={user}
                                        />
                                    </ClassWrapper>
                                );
                            })}
                        </FlipMove>
                    </table>
                </DragDropContext>
            </Row>
        </section>
    );
}

function Song(props) {
    return (
        <tr className={`song ${props.isDragging ? 'dragging' : ''} ${props.preview ? 'preview' : ''}`}
            {...props.provided?.draggableProps}
            ref={props.provided?.innerRef}
        >
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-sm-table-cell"
                           addToElem={{
                               ...props.provided?.dragHandleProps,
                               title: !props.preview ? "Eingefügt am " + moment(props.insertedAt).format("DD.MM.YYYY - HH:mm:ss") : ""
                           }}
            >{props.id}</DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-lg-table-cell"
                           addToElem={{title: moment.isDuration(props.startTime) ? "" : props.startTime.format("DD.MM.YYYY - HH:mm:ss")}}>
                {
                    moment.isDuration(props.startTime) ?
                        props.startTime.humanize(true)
                        :
                        <Moment fromNow>{props.startTime}</Moment>
                }
            </DragFixedCell>
            <DragFixedCell isDragOccurring={props.isDragging} className="d-none d-sm-table-cell author">
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
                <DragFixedCell isDragOccurring={props.isDragging} className="d-table-cell deleteicon" onClick={(e) => {
                    props.onDelete && props.onDelete(props.id, e.shiftKey)
                }}>
                    {props.onDelete && <FaTrashAlt/>}
                </DragFixedCell>
            }
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
                        <Col className="text-end" xs="auto"><span className="d-none d-lg-inline">Die Aktuelle Playlist umfasst </span>{props.duration} Minuten<span
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
                    <Row>
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
                    <Row>
                        <Col xs={{span: 6}}>{Config.showarchive && <Link to="/archiv">Zum Archiv</Link>}</Col>
                        <Col xs={{span: 6}}>
                            {props.admin &&
                                <div className="right-control">
                                    <VolumeControl onVolume={props.onVolume} setVolume={props.setVolume}
                                                   volume={props.volume}/>
                                    <Button onClick={props.onShuffle}>Shuffle</Button>
                                </div>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
}

export default withUser(Home);
