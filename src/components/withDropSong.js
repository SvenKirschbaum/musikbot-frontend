import React, {useState} from "react";

import './withDropSong.css'

function withDropSong(WrappedComponent) {
    return function (props) {
        const {sendSong, ...passThroughProps} = props;

        const [isDropping, setIsDropping] = useState(false);
        const [lastEnter, setLastEnter] = useState(undefined);

        const onDragEnter = (e) => {
            if (e.dataTransfer.types.includes("text/uri-list")) {
                setLastEnter(e.target);
                setIsDropping(true);
                e.preventDefault();
                e.stopPropagation();
            }
        }

        const onDragLeave = (e) => {
            if (e.dataTransfer.types.includes("text/uri-list")) {
                e.preventDefault();
                e.stopPropagation();
                if (lastEnter === e.target) {
                    setIsDropping(false);
                    setLastEnter(undefined);
                }
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

                setIsDropping(false);
                sendSong(e.dataTransfer.getData("text/uri-list"));
            }
        }

        return (
            <React.Fragment>
                <WrappedComponent {...passThroughProps} onDragEnter={onDragEnter} onDragLeave={onDragLeave}
                                  onDrop={onDrop} onDragOver={onDragOver}/>
                {isDropping && <DropNotification/>}
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