import {useContext, useEffect, useState} from "react";
import Config from "../components/Configuration";
import EntryCard from "../components/EntryCard";
import QuickAdd from "../components/QuickAdd";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";

import './Stats.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useRouteMatch} from "react-router";
import {AlertContext} from "../context/AlertContext";
import useDefaultHeaders from "../hooks/defaultHeaders.jsx";

function StatsList(props) {

    return (
        <Container fluid className="d-flex flex-column statscontainer">
            <Header/>
            <Row>
                <Col className="mb-6">
                    <EntryCard
                        title={props.title}
                        data={props.data}
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
                        }
                    />
                </Col>
            </Row>
        </Container>
    );
}

function UserStatsDetails(props) {
    const context = useContext(AlertContext);
    const defaultHeaders = useDefaultHeaders();

    const [data, setData] = useState([]);
    const match = useRouteMatch();
    const userName = match.params.name;


    useEffect(() => {
        const abortController = new AbortController();

        fetch(Config.apihost + "/api/v2/user/" + userName + "/" + props.subRoute, {
            method: 'GET',
            headers: defaultHeaders,
            signal: abortController.signal
        })
            .then((res) => {
                if (!res.ok) throw Error(res.statusText);
                return res;
            })
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            })
            .catch(reason => {
                context.handleException(reason);
            });

        return () => {
            abortController.abort();
        };
    }, [props.subRoute, userName, context]);

    return <StatsList data={data}/>
}

function StatsDetails(props) {
    const context = useContext(AlertContext);
    const defaultHeaders = useDefaultHeaders();

    const [data, setData] = useState([]);


    useEffect(() => {
        const abortController = new AbortController();

        fetch(Config.apihost + "/api/v2/stats/" + props.subRoute, {
            method: 'GET',
            headers: defaultHeaders,
            signal: abortController.signal
        })
            .then((res) => {
                if (!res.ok) throw Error(res.statusText);
                return res;
            })
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            })
            .catch(reason => {
                context.handleException(reason);
            });

        return () => {
            abortController.abort();
        };
    }, [props.subRoute, context]);

    return <StatsList data={data}/>
}

export {StatsDetails, UserStatsDetails};
