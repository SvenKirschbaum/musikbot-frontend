import {useContext} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {TransitionGroup} from "react-transition-group";
import Alert from "react-bootstrap/Alert";

import "./Alerts.css";
import {AlertContext, AlertRenderContext} from "../context/AlertContext";
import {useSubscription} from "react-stomp-hooks";
import CSSTransitionWithRef from "./CSSTransitionWithRef.jsx";

function Alerts() {

    const alertsFunctions = useContext(AlertContext);
    const alerts = useContext(AlertRenderContext);

    useSubscription('/user/queue/errors', (message) => {
        const content = JSON.parse(message.body);
        alertsFunctions.addAlert({
            id: Math.random().toString(36),
            type: content.type || 'danger',
            head: content.header || 'Es ist ein Fehler aufgetreten',
            text: content.message || '',
            autoclose: true
        });
    });

    return (
        <Row className="justify-content-center">
            <Col xl={{span: 5}} md={{span: 8}} xs={{span: 10}} className="alerts">
                <TransitionGroup component={null}>
                    {alerts.map((alert) => {
                        return (
                            <CSSTransitionWithRef key={alert.id} timeout={300} classNames="alert-anim">
                                <Alert dismissible variant={alert.type} onClose={() => {
                                    alertsFunctions.removeAlert(alerts, alert.id)
                                }}>
                                    {alert.head && <Alert.Heading>{alert.head}</Alert.Heading>}
                                    {alert.text}
                                </Alert>
                            </CSSTransitionWithRef>
                        );
                    })}
                </TransitionGroup>
            </Col>
        </Row>
    );
}

export default Alerts;