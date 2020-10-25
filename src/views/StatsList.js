import {useContext, useEffect, useState} from "react";
import Config from "../components/Configuration";
import GlobalContext from "../components/GlobalContext";
import EntryCard from "../components/EntryCard";
import QuickAdd from "../components/QuickAdd";
import Header from "../components/Header";
import Container from "react-bootstrap/Container";

import './Stats.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {getDefaultHeaders} from "../hooks/defaultHeaders";

function StatsList(props) {

    const context = useContext(GlobalContext);

    const [data, setData] = useState([]);


    useEffect(() => {
        const abortController = new AbortController();

        fetch(Config.apihost + "/api/v2/stats/" + props.subRoute, {
            method: 'GET',
            headers: getDefaultHeaders(),
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
    }, [context, props.subRoute]);

    return (
        <Container fluid className="d-flex flex-column statscontainer">
            <Header/>
            <Row>
                <Col className="mb-6">
                    <EntryCard
                        title={props.title}
                        data={data}
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

export default StatsList;