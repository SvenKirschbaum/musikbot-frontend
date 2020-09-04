import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Songs from './views/Songs';
import NoMatch from './components/NoMatch';
import Config from "./components/Configuration";
import BaseLayout from './components/BaseLayout';
import Home from './views/Home';
import Archiv from './views/Archiv';
import Debug from './views/Debug';
import Log from './views/Log';
import Gapcloser from './views/Gapcloser';
import Stats from './components/Stats';
import Playlist from './views/Playlist';
import UserPage from './views/UserPage';
import GlobalContext from './components/GlobalContext';
import {AdminRoute} from "./components/Routes";
import UserList from "./views/UserList";
import {KeycloakProvider, useKeycloak} from "@react-keycloak/web";
import md5 from "md5"

import keycloak from "./keycloak";

function App() {
    return (
        <KeycloakProvider keycloak={keycloak} LoadingComponent={<div>"Loading..."</div>} initConfig={{
            onLoad: 'check-sso',
            promiseType: 'native',
            flow: 'implicit',
            checkLoginIframe: false,
            silentCheckSsoRedirectUri: window.location.origin + '/silent-sso.html'
        }}>
            <AppRouter/>
        </KeycloakProvider>
    );
}

function AppRouter(props) {

    const [keycloak] = useKeycloak()
    const [alerts, setAlerts] = useState([]);

    let defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "application/json");

    let user = {};
    if (keycloak.authenticated) {
        defaultHeaders.set("Authorization", "Bearer " + keycloak.token);
        user.name = keycloak.tokenParsed.preferred_username;
        user.email = keycloak.tokenParsed.email;
        user.gravatarId = md5(keycloak.tokenParsed.email);
        user.admin = keycloak.hasResourceRole("admin", "musikbot-backend");
    }

    let addAlert = (alert) => {
        let a = [...alerts];
        a.push(alert);
        setAlerts(a);
    }

    let removeAlert = (id) => {
        let a = [...alerts]; // make a separate copy of the array
        let index = -1;
        for (const [key, value] of Object.entries(a)) {
            if (value.id === id) {
                index = key;
            }
        }
        if (index !== -1) {
            a.splice(index, 1);
            setAlerts(a);
        }
    }

    let handleException = (e) => {
        //Ignore AbortController.abort()
        if (e.name === 'AbortError') return;
        addAlert({
            id: Math.random().toString(36),
            type: 'danger',
            head: 'Es ist ein Fehler aufgetreten',
            text: e.message,
            autoclose: false
        });
    }

    return (
        <Router>
            <GlobalContext.Provider
                value={{
                    loggedin: keycloak.authenticated,
                    user,
                    defaultHeaders: defaultHeaders,
                    alerts: alerts,
                    addAlert: addAlert,
                    removeAlert: removeAlert,
                    handleException: handleException,
                    login: () => keycloak.login(),
                    logout: () => keycloak.logout()
                }}>
                <BaseLayout>
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        {Config.enableusers && <Route path="/user/:name" component={UserPage}/>}
                        {Config.showarchive && <Route path="/archiv/:page?" component={Archiv}/>}
                        {Config.showstats && <Route path="/statistik" component={Stats}/>}
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

export default App;
