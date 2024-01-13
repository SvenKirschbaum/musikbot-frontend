import {useEffect, useMemo, useState} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Header from '../components/Header';

import './Gapcloser.css';
import {useStompClient, useSubscription} from "react-stomp-hooks";

function Gapcloser() {
    const [state, setState] = useState({})

    const client = useStompClient()
    useSubscription(['/topic/gapcloser', '/musikbot/gapcloser'], (msg) => {
        setState(JSON.parse(msg.body));
    });

    const save = (e) => {
        e.preventDefault();
        client.publish({
            destination: '/musikbot/gapcloser',
            body: JSON.stringify({mode: state.mode, playlist: state.playlist}),
        })
    }

    return (
        <Container fluid>
            <Header/>
            <Row className="justify-content-center">
                <Col className="gapcloser">
                    Gapcloser - Einstellungen
                    <form>
                        <div>
                            <label>Modus:</label>
                            <select className="grow" value={state.mode}
                                    onChange={(e) => setState((prev) => ({...prev, mode: e.target.value}))}>
                                <option value="OFF">Aus</option>
                                <option value="RANDOM">Zufällig</option>
                                <option value="RANDOM100">Zufällig - Top 100</option>
                                <option value="PLAYLIST">Playlist</option>
                            </select>
                        </div>
                        {state.mode === "PLAYLIST" &&
                            <PlaylistConfig
                                playlist={state.playlist}
                                playlistName={state.playlistName}
                                setPlaylist={(v) => setState((prev) => ({...prev, playlist: v}))}
                                history={state.history}
                            />
                        }
                        <button onClick={save}>Speichern</button>
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

function PlaylistConfig(props) {
    const currentPlaylistURL = useMemo(() => props.playlist, [props.playlistName]);

    const list = [{
        name: props.playlistName,
        url: currentPlaylistURL
    }].concat(props.history);

    const isNewURL = list.find((e) => e.url === props.playlist) === undefined;

    //Reset parent state on unmount to prevent edge cases
    useEffect(() => {
        return () => {
            props.setPlaylist(currentPlaylistURL);
        }
    }, []);

    return (
        <div>
            <label>Playlist:</label>
            <div className="gapcloser-playlist-list grow">
                <label className="gapcloser-playlist-list-entry">
                    <div><input type="radio" checked={isNewURL} readOnly/></div>
                    <div><input type="text" value={isNewURL ? props.playlist : ""}
                                onChange={(e) => props.setPlaylist(e.target.value)}/></div>
                </label>
                {list.map(({name, url}) =>
                    <label key={name + url} className="gapcloser-playlist-list-entry">
                        <div><input type="radio" checked={props.playlist === url}
                                    onChange={(e) => props.setPlaylist(url)}/></div>
                        <div><a href={url}>{name}</a></div>
                    </label>
                )}
            </div>
        </div>
    );
}

export default Gapcloser;
