import {Navigate} from "react-router-dom";
import useUser from "../hooks/user";

function RequireAdmin(props) {
    const user = useUser();

    return (user && user.admin) ? props.children : <Navigate to='/'/>;
}

function RequiredLoggedIn(props) {
    const user = useUser();

    return user ? props.children : <Navigate to='/'/>;
}

export {RequireAdmin, RequiredLoggedIn};