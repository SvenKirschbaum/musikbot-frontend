import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Songs from './views/Songs';
import NoMatch from './components/NoMatch';
import BaseLayout from './components/BaseLayout';
import Home from './views/Home';
import Archiv from './views/Archiv';
import Token from './views/Token';
import Debug from './views/Debug';
import Log from './views/Log';
import Gapcloser from './views/Gapcloser';
import Stats from './views/Stats';
import Playlist from './views/Playlist';
import UserPage from './views/UserPage';
import GlobalContext from './components/GlobalContext';


class AppRouter extends Component {

    constructor(props) {
        super(props);

        this.defaultHeaders = new Headers();
        this.defaultHeaders.append("Content-Type", "application/json");

        let loadstate = JSON.parse(localStorage.getItem('loginstate'));
        if(loadstate) {
            this.state = {
                loggedin: loadstate.loggedin,
                user: {},
                token: loadstate.token,
                loading: true,
                alerts: []
            };
            this.defaultHeaders.append("Authorization", "Bearer " + this.state.token);
            this.loadUser();
        }
        else {
            this.state = {
                loggedin: false,
                user: {},
                token: null,
                loading: false,
                alerts: []
            };
        }

        this.addAlert = this.addAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);

        this.handleException = this.handleException.bind(this);

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.loadUser = this.loadUser.bind(this);
    }

    addAlert(alert) {
        var alerts = [...this.state.alerts];
        alerts.push(alert);
        this.setState({alerts: alerts});
    }

    removeAlert(id) {
        var alerts = [...this.state.alerts]; // make a separate copy of the array
        let index = -1;
        for (const [key, value] of Object.entries(alerts)) {
            if (value.id === id) {
                index = key;
            }
        }
        if (index !== -1) {
            alerts.splice(index, 1);
            this.setState({alerts: alerts});
        }
    }

    handleException(e) {
        this.addAlert({
            id: Math.random().toString(36),
            type: 'danger',
            head: 'Es ist ein Fehler aufgetreten',
            text: e.message,
            autoclose: false
        });
    }

    login(username, password) {
        return new Promise((resolve,reject) => {
            fetch("/api/v2/login", {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            })
                .then(res => res.json())
                .then(response => {
                    if(response.success) {
                        this.setState({
                            loggedin: true,
                            token: response.token
                        });
                        localStorage.setItem('loginstate', JSON.stringify({
                            loggedin: true,
                            token: response.token
                        }));
                        this.defaultHeaders.append("Authorization", "Bearer " + response.token);
                        this.loadUser();
                        resolve();
                    }
                    else {
                        reject(response.error);
                    }
                });
        });
    }

    logout() {
        fetch("/api/v2/logout", {
            method: 'POST',
            headers: this.defaultHeaders
        })
        .catch((res) => {
            console.error("Error logging out" + res);
        });


        this.loggedin = false;
        this.user = null;
        this.setState({
            loggedin: false,
            user: {},
            token: null,
            loading: false,
        });
        this.defaultHeaders.delete("Authorization");
        localStorage.removeItem('loginstate');
    }

    loadUser() {
        fetch("/api/v2/user/self", {
            method: 'GET',
            headers: this.defaultHeaders
        })
        .then((res) => res.json())
        .then((res) => {
            this.setState({
                user: res,
                loading: false
            });
        })
        .catch((res) => {
           console.warn("Error loading user, the token probably timed out" + res);
           this.logout();
        });
    }

    render() {
        if(!this.state.loading) {
            return (
                <Router>
                    <GlobalContext.Provider
                        value={{
                            ...this.state,
                            defaultHeaders: this.defaultHeaders,
                            login: this.login,
                            logout: this.logout,
                            reload: this.loadUser,
                            alerts: this.state.alerts,
                            addAlert: this.addAlert,
                            removeAlert: this.removeAlert,
                            handleException: this.handleException,
                        }}>
                        <BaseLayout>
                            <Switch>
                                <Route path="/" exact component={Home}/>
                                <Route path="/songs" component={Songs}/>
                                <Route path="/archiv/:page?" component={Archiv}/>
                                <Route path="/token" component={Token}/>
                                <Route path="/debug" component={Debug}/>
                                <Route path="/log" component={Log}/>
                                <Route path="/gapcloser" component={Gapcloser}/>
                                <Route path="/statistik" component={Stats}/>
                                <Route path="/import" component={Playlist}/>
                                <Route path="/users/:name" component={UserPage}/>
                                <Route component={NoMatch}/>
                            </Switch>
                        </BaseLayout>
                    </GlobalContext.Provider>
                </Router>
            );
        }
        else {
            return "Loading...";
        }
    }
}
export {GlobalContext as AuthState};
export default AppRouter;
