import "./ConnectionIndicator.css";
import {FaCircleExclamation} from "react-icons/fa6";
import {useStompClient} from "react-stomp-hooks";

export default function ConnectionIndicator() {
    const client = useStompClient();

    if (client !== undefined) {
        return "";
    }

    return (
        <div title="Connection to server was lost, trying to reconnect..."
             className="connection-indicator d-sm-block d-none">
            <FaCircleExclamation/>
        </div>
    );
}