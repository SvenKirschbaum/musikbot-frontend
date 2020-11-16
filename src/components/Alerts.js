import {useContext} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {TransitionGroup} from "react-transition-group";
import CSSTransition from "react-transition-group/CSSTransition";
import Alert from "react-bootstrap/Alert";

import "./Alerts.css";
import {AlertContext, AlertRenderContext} from "../context/AlertContext";

function Alerts() {

    const alertsFunctions = useContext(AlertContext);
    const alerts = useContext(AlertRenderContext);

    return (
        <Row className="justify-content-center">
            <Col xl={{span: 5}} md={{span: 8}} xs={{span: 10}} className="alerts">
                <TransitionGroup component={null}>
                    {alerts.map((alert) => {
                        return (
                            <CSSTransition key={alert.id} timeout={300} classNames="alert-anim">
                                <Alert dismissible variant={alert.type} onClose={() => {
                                    alertsFunctions.removeAlert(alerts, alert.id)
                                }}>
                                    {alert.head && <Alert.Heading>{alert.head}</Alert.Heading>}
                                    {alert.text}
                                </Alert>
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </Col>
        </Row>
    );
}

export default Alerts;