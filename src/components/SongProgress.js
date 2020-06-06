import React, {useEffect, useState} from "react";
import Row from "react-bootstrap/Row";

import "./SongProgress.css";
import * as moment from "moment";
import 'moment-duration-format';
import {Col} from "react-bootstrap";

const SongProgress = (props) => {
    const [baseDate, setBaseDate] = useState(moment());
    const [current, setCurrent] = useState(moment(props.children.current));

    useEffect(() => {
        let id = setInterval(() => {
            let now = moment();
            let timediff = now.diff(moment(baseDate));
            setCurrent(current.clone().add(timediff));
            setBaseDate(now);
        }, 500);

        return () => clearInterval(id);
    });

    const getDuration = () => {
        return moment.duration(props.children.duration);
    };

    const getProgress = () => {
        let duration = moment.duration(props.children.prepausedDuration);

        if(!props.children.paused) {
            duration.add(moment.duration(current.diff(moment(props.children.start))));
        }

        if(duration.asMilliseconds() > getDuration().asMilliseconds()) return getDuration();
        else return duration
    };

    const getPercentage = () => {
        return Math.min(100*getProgress().asMilliseconds()/getDuration().asMilliseconds(),100);
    };

    return (
        <Row>
            <Col className="song-progress-container">
                <div className="song-progress-bar">
                    <div
                        className="song-progress-bar-progress"
                        style={{
                            width: `${getPercentage()}%`,
                        }}
                    />
                    {/*<div
                        className="song-progress-bar-handle"
                        style={{
                            left: `${getPercentage()}%`,
                        }}
                    />*/}
                </div>
                <div className="d-inline song-progress-time">
                    {getProgress().format("m:ss", {trim: false})}/{getDuration().format("m:ss", {trim: false})}
                </div>
            </Col>
        </Row>
    );
};
export default SongProgress;