import {Redirect, Route} from "react-router-dom";
import useUser from "../hooks/user";

function AdminRoute(props) {
    const {component: Component, ...rprops} = props;

    const user = useUser();

    return (
        <Route
            {...rprops}
            render={props => (
                user && user.admin ?
                    <Component {...props} /> :
                    <Redirect to='/'/>
            )}
        />
    )
}

function LoggedinRoute(props) {
    const {component: Component, ...rprops} = props;

    const user = useUser();

    return (
        <Route
            {...rprops}
            render={props => (
                user ?
                    <Component {...props} /> :
                    <Redirect to='/'/>
            )}
        />
    )
}

function AnonymousRoute(props) {
    const {component: Component, ...rprops} = props;

    const user = useUser();

    return (
        <Route
            {...rprops}
            render={props => (
                !user ?
                    <Component {...props} /> :
                    <Redirect to='/'/>
            )}
        />
    )
}

export {AdminRoute, LoggedinRoute, AnonymousRoute};