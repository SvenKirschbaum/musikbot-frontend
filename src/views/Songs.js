import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';

import GlobalContext from '../components/GlobalContext';
import Header from '../components/Header';

import './Songs.css';
import {FaTrashAlt} from "react-icons/fa";
import AddSong from "../components/AddSong";

class Songs extends Component {

    static contextType = GlobalContext;

    constructor(props) {
        super(props);
        this.state = {
            songs: []
        };

        this.load=this.load.bind(this);
        this.sendDelete=this.sendDelete.bind(this);
        this.sendSong=this.sendSong.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    load() {
        fetch("/api/v2/lockedsongs", {
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
                songs: res
            });
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }



    sendDelete(id) {
        fetch("/api/v2/lockedsongs/" + id, {
            method: 'DELETE',
            headers: this.context.defaultHeaders
        }).then((res) => {
            if (!res.ok) throw Error(res.statusText);
            this.load();
        })
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    sendSong(url) {
        let headers = new Headers(this.context.defaultHeaders);
        headers.set("Content-Type", "text/plain");
        fetch("/api/v2/lockedsongs", {
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
        .finally(() => {
            this.load();
        });
    }

    render() {
        return (
            <Container fluid className="lockedsongs">
                <Header />
                <SongList data={this.state.songs} onDelete={this.sendDelete} />
                <AddSong sendSong={this.sendSong} buttontext="Sperren" />
            </Container>
        );
    }
}

function SongList(props) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Titel</th>
                <th>URL</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                {props.data.map((entry) => (
                    <tr key={entry.id}>
                        <td>{entry.id}</td>
                        <td>{entry.title}</td>
                        <td><a href={entry.url}>{entry.url}</a></td>
                        <td className="deleteicon" onClick={(e) => props.onDelete(entry.id)}><FaTrashAlt/></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Songs;