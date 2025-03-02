import moment from "moment/min/moment-with-locales";
import {useEffect, useRef} from "react";
import {useUniqueId} from "@dnd-kit/utilities";

const globalRelativeTimeRefs = {};

setInterval(() => {
    for (const key in globalRelativeTimeRefs) {
        if (!globalRelativeTimeRefs.hasOwnProperty(key)) continue;
        const ref = globalRelativeTimeRefs[key];
        ref.ref.current.innerText = moment(ref.date).fromNow();
    }
}, 10000);

export default function RelativeTime(props) {
    const id = useUniqueId("");
    const ref = useRef(null);

    useEffect(() => {
        globalRelativeTimeRefs[id] = {
            ref: ref,
            date: props.children
        }

        return () => {
            delete globalRelativeTimeRefs[id];
        }
    });

    return <span ref={ref}>{moment(props.children).fromNow()}</span>
}