import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import {TransitionGroup} from "react-transition-group";

import '../views/Stats.css';
import CSSTransitionWithRef from "./CSSTransitionWithRef.jsx";

export default function EntryCard(props) {
    return (
        <div className="statscard">
            <Card className="h-100">
                <Card.Body>
                    <Card.Title>
                        {props.link ? <Link to={props.link}>{props.title}</Link> : props.title}
                    </Card.Title>
                    <table>
                        <thead>
                        {props.header}
                        </thead>
                        <TransitionGroup component="tbody" enter={true} exit={false}>
                            {props.data.map(
                                (entry, key) => (
                                    <CSSTransitionWithRef key={key} timeout={300} classNames="fade">
                                        {props.mapfunction(entry, key)}
                                    </CSSTransitionWithRef>
                                )
                            )}
                        </TransitionGroup>
                    </table>
                </Card.Body>
            </Card>
        </div>
    );
}
