import {Component} from "react";
import GlobalContext from "../components/GlobalContext";
import Container from "react-bootstrap/Container";

import './Playlist.css';
import Header from "../components/Header";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import TransitionGroup from "react-transition-group/TransitionGroup";
import CSSTransition from "react-transition-group/CSSTransition";
import Config from "../components/Configuration";
import {getDefaultHeaders} from "../hooks/defaultHeaders";

class Playlist extends Component {
    static contextType = GlobalContext;

    constructor(props) {
        super(props);

        this.state = {
            url: "",
            songs: [],
            checkboxes: [],
            selectAll: true,
            name: "",
            link: ""
        };

        this.abortController = new AbortController();

        this.onCheckbox = this.onCheckbox.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleLoad(e) {
        e.preventDefault();
        fetch(Config.apihost + "/api/v2/playlist?url=" + encodeURIComponent(this.state.url), {
            method: 'GET',
            headers: getDefaultHeaders(),
            signal: this.abortController.signal
        })
        .then((res) => {
            if(res.status === 404) {
                this.context.addAlert({
                    id: Math.random().toString(36),
                    type: 'danger',
                    text: "Playlist nicht gefunden",
                    autoclose: true
                });
                return;
            }
            if(!res.ok) throw Error(res.statusText);

            res.json().then(value => this.setState({...value, checkboxes: new Array(value.songs.length).fill(true)}));
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    onSubmit() {
        fetch(Config.apihost + "/api/v2/playlist", {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: JSON.stringify(this.state.songs.filter((value, index) => this.state.checkboxes[index]))
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => res.json())
        .then((res) => {
            let results = [];
            res.forEach((e,key) => {
                let type = e.success ? 'success' : 'danger';
                if (e.warn && e.success) type = 'warning';
                results.push(
                    <li key={key} className={type}>
                        {e.message}
                    </li>
                );
            });

            let note = (<ul>{results}</ul>);

            this.context.addAlert({
                id: Math.random().toString(36),
                type: 'info',
                head: 'Playlist importiert',
                text: note,
                autoclose: false
            });
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    onCheckbox(id,e) {
        let checkboxes = [...this.state.checkboxes];
        checkboxes[id] = e.target.checked;
        this.setState({checkboxes: checkboxes});
    }

    onSelectAll() {
        let checkboxes = new Array(this.state.checkboxes.length).fill(!this.state.selectAll);
        this.setState({
            selectAll: !this.state.selectAll,
            checkboxes: checkboxes
        })
    }

    render() {
        return (
            <Container fluid>
                <Header />
                <Row className="justify-content-center">
                    <Col xl={{span: 9}} lg={{span: 10}} md={{span: 11}} xs={{span: 11}}>
                        <table className="importlist">
                            <thead>
                                <tr className="playlisturl">
                                    <th colSpan={3}>
                                        <form onSubmit={this.handleLoad}>
                                            <Row className="align-items-center">
                                                <Col xl={{span:6}} xs={{span:12}} className="playlisttitle"><a href={this.state.link}>{this.state.name}</a></Col>
                                                <Col xl={{span:5}} xs={{span:8}}><input type="text" onChange={this.handleInputChange} name="url" value={this.state.url} /></Col>
                                                <Col xl={{span:1}} xs={{span:4}}><Button type="submit">Laden</Button></Col>
                                            </Row>
                                        </form>
                                    </th>
                                </tr>
                                {this.state.songs.length>0 && (
                                    <tr>
                                        <th><input type="checkbox" checked={this.state.selectAll} onChange={this.onSelectAll} /></th>
                                        <th>Titel</th>
                                        <th>Link</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                <TransitionGroup component={null} exit={false}>
                                    {this.state.songs.map((song,key) => (
                                        <CSSTransition key={song.link} timeout={300} classNames="song-anim">
                                            <Song key={song.link + key} checked={this.state.checkboxes[key]} onChange={this.onCheckbox.bind(this,key)} title={song.name} link={song.link} />
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            </tbody>
                            <tfoot>
                            {this.state.songs.length>0 && (
                                <tr>
                                    <th/>
                                    <th/>
                                    <th>
                                        <Button disabled={this.state.songs.length===0} onClick={this.onSubmit}>Einfügen</Button>
                                    </th>
                                </tr>
                            )}
                            </tfoot>
                        </table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function Song(props) {
    return (
        <tr>
            <td><input type="checkbox" checked={props.checked} onChange={props.onChange} /></td>
            <td>{props.title}</td>
            <td><a href={props.link}>{props.link}</a></td>
        </tr>
    );
}

export default Playlist;