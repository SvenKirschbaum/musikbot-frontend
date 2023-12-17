import {Component, useEffect, useMemo} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Header from '../components/Header';

import './Gapcloser.css';
import Config from "../components/Configuration";
import {getDefaultHeaders} from "../hooks/defaultHeaders";
import {AlertContext} from "../context/AlertContext";

class Gapcloser extends Component {

    static contextType = AlertContext;

    constructor(props) {
        super(props);
        this.state = {
            playlist: "",
            mode : ''
        };

        this.abortController = new AbortController();

        this.load = this.load.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    load() {
        fetch(Config.apihost + "/api/v2/gapcloser", {
            method: 'GET',
            headers: getDefaultHeaders(),
            signal: this.abortController.signal
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => res.json())
        .then((res) => {
            this.setState(res);
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    save(e) {
        e.preventDefault();
        fetch(Config.apihost + "/api/v2/gapcloser", {
            method: 'PUT',
            body: JSON.stringify({mode: this.state.mode, playlist: this.state.playlist}),
            headers: getDefaultHeaders(),
            signal: this.abortController.signal
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => res.json())
        .then((res) => {
            this.setState(res);
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <Row className="justify-content-center">
                    <Col className="gapcloser">
                        Gapcloser - Einstellungen
                        <form>
                            <div>
                                <label>Modus:</label>
                                <select className="grow" value={this.state.mode}
                                        onChange={(e) => this.setState({mode: e.target.value})}>
                                    <option value="OFF">Aus</option>
                                    <option value="RANDOM">Zufällig</option>
                                    <option value="RANDOM100">Zufällig - Top 100</option>
                                    <option value="PLAYLIST">Playlist</option>
                                </select>
                            </div>
                            {this.state.mode === "PLAYLIST" &&
                                <PlaylistConfig
                                    playlist={this.state.playlist}
                                    playlistName={this.state.playlistName}
                                    setPlaylist={(v) => this.setState({playlist: v})}
                                    history={this.state.history}
                                />
                            }
                            <button onClick={this.save}>Speichern</button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
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
