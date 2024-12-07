import {Redirect} from "react-router-dom";
import useUser from "../hooks/user";

function RequireAdmin(props) {
    const user = useUser();

    return (user && user.admin) ? props.children : <Redirect to='/'/>;
}

function RequiredLoggedIn(props) {
    const user = useUser();

    return user ? props.children : <Redirect to='/'/>;
}

export {RequireAdmin, RequiredLoggedIn};