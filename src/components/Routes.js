import {Component} from "react";
import {Redirect, Route} from "react-router-dom";
import GlobalContext from "./GlobalContext";

class AdminRoute extends Component {

    static contextType = GlobalContext;

    render() {
        const { component: Component, ...props } = this.props;

        return (
            <Route
                {...props}
                render={props => (
                    this.context.loggedin && this.context.user.admin ?
                        <Component {...props} /> :
                        <Redirect to='/' />
                )}
            />
        )
    }
}

class LoggedinRoute extends Component {

    static contextType = GlobalContext;

    render() {
        const { component: Component, ...props } = this.props;

        return (
            <Route
                {...props}
                render={props => (
                    this.context.loggedin ?
                        <Component {...props} /> :
                        <Redirect to='/' />
                )}
            />
        )
    }
}

class AnonymousRoute extends Component {

    static contextType = GlobalContext;

    render() {
        const { component: Component, ...props } = this.props;

        return (
            <Route
                {...props}
                render={props => (
                    !this.context.loggedin ?
                        <Component {...props} /> :
                        <Redirect to='/' />
                )}
            />
        )
    }
}

export {AdminRoute, LoggedinRoute, AnonymousRoute};