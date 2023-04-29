import {Component} from 'react';
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
                                <select value={this.state.mode} onChange={(e) => this.setState({mode: e.target.value})}>
                                    <option value="OFF">Aus</option>
                                    <option value="RANDOM">Zufällig</option>
                                    <option value="RANDOM100">Zufällig - Top 100</option>
                                    <option value="PLAYLIST">Playlist</option>
                                </select>
                            </div>
                            {this.state.mode === "PLAYLIST" && <div><label>Playlist:</label><input type="text" value={this.state.playlist} onChange={(e) => this.setState({playlist: e.target.value})} /></div>}
                            <button onClick={this.save}>Speichern</button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Gapcloser;