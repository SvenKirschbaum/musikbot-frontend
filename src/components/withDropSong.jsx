import React, {useState} from "react";

import './withDropSong.css'

function withDropSong(WrappedComponent) {
    return function (props) {
        const {sendSong, ...passThroughProps} = props;

        const [dropCount, setDropCount] = useState(0);

        const onDragEnter = (e) => {
            if (e.dataTransfer.types.includes("text/uri-list")) {
                setDropCount((c) => c + 1);
                e.preventDefault();
                e.stopPropagation();
            }
        }

        const onDragLeave = (e) => {
            if (e.dataTransfer.types.includes("text/uri-list")) {
                e.preventDefault();
                e.stopPropagation();
                setDropCount((c) => c > 1 ? c - 1 : 0);
            }
        }

        const onDragOver = (e) => {
            if (e.dataTransfer.types.includes("text/uri-list")) {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        const onDrop = (e) => {
            if (e.dataTransfer.types.includes("text/uri-list")) {
                e.preventDefault();
                e.stopPropagation();

                setDropCount(0);
                sendSong(e.dataTransfer.getData("text/uri-list"));
            }
        }

        return (
            <React.Fragment>
                <WrappedComponent {...passThroughProps} onDragEnter={onDragEnter} onDragLeave={onDragLeave}
                                  onDrop={onDrop} onDragOver={onDragOver}/>
                {dropCount > 0 && <DropNotification/>}
            </React.Fragment>
        );

    };
}

function DropNotification() {
    return (
        <div className={"dropNotification"}>
            <div className={"dropNotificationMessage"}>
                Link zum Hinzufügen ablegen
            </div>
        </div>
    );
}

export default withDropSong;