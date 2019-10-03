import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
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
import Register from "./views/Register";
import GlobalContext from './components/GlobalContext';
import {AdminRoute, AnonymousRoute, LoggedinRoute} from "./components/Routes";
import UserList from "./views/UserList";


class AppRouter extends Component {

    constructor(props) {
        super(props);

        this.defaultHeaders = new Headers();
        this.defaultHeaders.append("Content-Type", "application/json");

        this.state = {
            loggedin: false,
            extension: false,
            user: {},
            token: null,
            loading: true,
            alerts: []
        };

        this.addAlert = this.addAlert.bind(this);
        this.removeAlert = this.removeAlert.bind(this);

        this.handleException = this.handleException.bind(this);

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.loadUser = this.loadUser.bind(this);
        this.loadTokenFromStorage = this.loadTokenFromStorage.bind(this);
        this.loadTokenFromExtension = this.loadTokenFromExtension.bind(this);
        this.loadToken = this.loadToken.bind(this);
    }

    componentDidMount() {
        // eslint-disable-next-line no-undef
        if(typeof(chrome) !== "undefined" && typeof(chrome.runtime) !== "undefined" && typeof(chrome.runtime.sendMessage) !== "undefined") {
            this.loadTokenFromExtension();
        }
        else {
            this.loadTokenFromStorage();
        }
    }

    loadTokenFromExtension() {
        // eslint-disable-next-line no-undef
        chrome.runtime.sendMessage(process.env.REACT_APP_CHROME_EXTENSION_ID,"token-request",{},(response) => {
            // eslint-disable-next-line no-undef
            if(!chrome.runtime.lastError && response && response.authtoken) {
                this.setState({
                    loggedin: true,
                    token: response.authtoken,
                    extension: true
                });
                this.defaultHeaders.set("Authorization", "Bearer " + response.authtoken);
                this.loadUser();
            }
            else {
                this.loadTokenFromStorage();
            }
        })
    }

    loadTokenFromStorage() {
        let loadstate = JSON.parse(localStorage.getItem('loginstate'));
        if(loadstate) {
            this.setState({
                loggedin: loadstate.loggedin,
                token: loadstate.token
            });
            this.defaultHeaders.set("Authorization", "Bearer " + loadstate.token);
            this.loadUser();
        }
        else {
            this.defaultHeaders.delete("Authorization");
            this.setState({
                loggedin: false,
                token: null,
                loading: false,
            });
        }
    }

    addAlert(alert) {
        let alerts = [...this.state.alerts];
        alerts.push(alert);
        this.setState({alerts: alerts});
    }

    removeAlert(id) {
        let alerts = [...this.state.alerts]; // make a separate copy of the array
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
                        this.defaultHeaders.set("Authorization", "Bearer " + response.token);
                        this.loadUser();
                        resolve();
                    }
                    else {
                        reject(response.error);
                    }
                });
        });
    }

    loadToken(token){
        this.setState({
            loggedin: true,
            loading: true,
            token: token,
            user: {}
        });
        localStorage.setItem('loginstate', JSON.stringify({
            loggedin: true,
            token: token
        }));
        this.defaultHeaders.set("Authorization", "Bearer " + token);
        this.loadUser();
    }

    logout() {
        fetch("/api/v2/logout", {
            method: 'POST',
            headers: this.defaultHeaders
        })
        .catch((res) => {
            console.error("Error logging out" + res);
        });

        this.setState({
            loggedin: false,
            user: {},
            token: null,
            loading: false,
            extension: false
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
            if(this.state.extension) {
                console.warn("Extension supplied invalid Token, falling back to default behavior");
                this.setState({
                    extension: false
                });
                this.loadTokenFromStorage();
            }
            else {
                console.warn("Error loading user, the token probably timed out" + res);
                this.logout();
            }
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
                            loadToken: this.loadToken,
                            alerts: this.state.alerts,
                            addAlert: this.addAlert,
                            removeAlert: this.removeAlert,
                            handleException: this.handleException,
                        }}>
                        <BaseLayout>
                            <Switch>
                                <Route path="/" exact component={Home}/>
                                <Route path="/user/:name" component={UserPage}/>
                                <Route path="/archiv/:page?" component={Archiv}/>
                                <Route path="/statistik" component={Stats}/>
                                <AnonymousRoute path="/register" component={Register}/>
                                <LoggedinRoute path="/token" component={Token}/>
                                <AdminRoute path="/debug" component={Debug}/>
                                <AdminRoute path="/log" component={Log}/>
                                <AdminRoute path="/gapcloser" component={Gapcloser}/>
                                <AdminRoute path="/import" component={Playlist}/>
                                <AdminRoute path="/songs" component={Songs}/>
                                <AdminRoute path="/users/:page?" component={UserList}/>
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
export default AppRouter;
