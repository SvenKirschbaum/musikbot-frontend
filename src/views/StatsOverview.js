import {Component} from 'react';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import Header from '../components/Header';
import QuickAdd from "../components/QuickAdd";

import './Stats.css';
import {Link} from "react-router-dom";
import Config from "../components/Configuration";
import EntryCard from "../components/EntryCard";
import {getDefaultHeaders} from "../hooks/defaultHeaders";
import {AlertContext} from "../context/AlertContext";

class StatsOverview extends Component {

    static contextType = AlertContext;

    constructor(props) {
        super(props);
        this.state = {
            mostPlayed: [],
            mostSkipped: [],
            topUsers: [],
            general: []
        };

        this.abortController = new AbortController();

        this.load = this.load.bind(this);
    }

    componentDidMount() {
        this.load();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    load() {
        fetch(Config.apihost + "/api/v2/stats", {
            method: 'GET',
            headers: getDefaultHeaders(),
            signal: this.abortController.signal
        })
        .then((res) => {
            if(!res.ok) throw Error(res.statusText);
            return res;
        })
        .then((res) => res.json())
        .then(value => this.setState(value))
        .catch(reason => {
            this.context.handleException(reason);
        });
    }

    render() {
        return (
            <Container fluid className="d-flex flex-column statscontainer">
                <Header/>
                <Row className="statsrow">
                    <EntryCard title="Am meisten gewünscht" data={this.state.mostPlayed} link="/statistik/played"
                               mapfunction={
                                   (entry, key) => (
                                       <tr key={key}>
                                           <td className="idcolumn">{key + 1}.</td>
                                           <td><QuickAdd>{entry.link}</QuickAdd></td>
                                           <td><a href={entry.link}>{entry.title}</a></td>
                                           <td>{entry.count}</td>
                                       </tr>
                                   )
                               }
                               header={
                                   <tr>
                                       <th className="idcolumn">Nr.</th>
                                       <th className="idcolumn"/>
                                       <th>Titel</th>
                                       <th>Anzahl</th>
                                   </tr>
                               }/>
                    <EntryCard title="Am meisten geskippt" data={this.state.mostSkipped} link="/statistik/skipped"
                               mapfunction={
                                   (entry, key) => (
                                       <tr key={key}>
                                           <td className="idcolumn">{key + 1}.</td>
                                           <td><QuickAdd>{entry.link}</QuickAdd></td>
                                           <td><a href={entry.link}>{entry.title}</a></td>
                                           <td>{entry.count}</td>
                                       </tr>
                                   )
                               }
                               header={
                                   <tr>
                                       <th className="idcolumn">Nr.</th>
                                       <th className="idcolumn"/>
                                       <th>Titel</th>
                                       <th>Anzahl</th>
                                   </tr>
                               }/>

                    <EntryCard title="Top Wünscher" data={this.state.topUsers} mapfunction={
                        (entry, key) => (
                            <tr key={key}>
                                <td className="idcolumn">{key+1}.</td>
                                <td><Link to={`/user/${entry.name}`}>{entry.name}</Link></td>
                                <td>{entry.count}</td>
                            </tr>
                        )
                    }
                    header={
                        <tr>
                            <th className="idcolumn">Nr.</th>
                            <th>Name</th>
                            <th>Anzahl</th>
                        </tr>
                    } />

                    <EntryCard title="Allgemeines" data={this.state.general} mapfunction={
                        (entry,key) => (
                            <tr key={key}>
                                <td>{entry.title}:</td>
                                <td>{entry.value}</td>
                            </tr>
                        )
                    }
                    header={
                        <tr>
                            <th>Titel</th>
                            <th>Anzahl</th>
                        </tr>
                    } />
                </Row>
            </Container>
        );
    }
}

export default StatsOverview;