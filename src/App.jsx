import {StrictMode, useCallback, useEffect, useRef, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Songs from './views/Songs';
import NoMatch from './components/NoMatch';
import Config from "./components/Configuration";
import BaseLayout from './components/BaseLayout';
import Home from './views/Home';
import Archiv from './views/Archiv';
import Debug from './views/Debug';
import Gapcloser from './views/Gapcloser';
import Stats from './components/Stats';
import Playlist from './views/Playlist';
import UserPage from './views/User';
import {AdminRoute} from "./components/Routes";
import UserList from "./views/UserList";

import {AlertContext, AlertRenderContext} from "./context/AlertContext";
import {StompSessionProvider} from "react-stomp-hooks";
import ErrorBoundary from "./components/ErrorBoundary";
import {Join} from "./views/Join";
import {AuthProvider, useAuth} from "react-oidc-context";
import useDefaultHeaders from "./hooks/defaultHeaders";

function App() {

    const onSigninCallback = useCallback(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    return (
        <StrictMode>
            <AuthProvider
                authority={import.meta.env.VITE_OIDC_AUTHORITY}
                client_id={import.meta.env.VITE_OIDC_CLIENT_ID}
                redirect_uri={window.location.origin.toString()}
                automaticSilentRenew={true}
                onSigninCallback={onSigninCallback}
            >
                <AppRouter/>
            </AuthProvider>
        </StrictMode>
    );
}

function AppRouter() {
    const [alerts, setAlerts] = useState([]);
    const prevAlertsRef = useRef(alerts);

    const auth = useAuth();
    const defaultHeaders = useDefaultHeaders();

    useEffect(() => {
        if (auth.isAuthenticated) {
            const guestToken = sessionStorage.getItem('guestToken');

            if (guestToken) {
                const headers = new Headers(defaultHeaders);
                headers.set("X-Guest-Token", guestToken);

                fetch(Config.apihost + "/api/guest", {
                    method: 'POST',
                    headers: headers
                })
                    .then((res) => {
                        if (!res.ok) throw Error(res.statusText);
                        return res;
                    })
                    .catch(reason => {
                        handleException(reason);
                    });
            }
        }
    }, [auth.isAuthenticated])

    useEffect(() => {
        const diff = alerts.filter(x => !prevAlertsRef.current.includes(x));
        diff.forEach(value => {
            if (value.autoclose) {
                setTimeout(() => {
                    removeAlert(prevAlertsRef.current, value.id);
                }, 3000);
            }
        })

        prevAlertsRef.current = alerts;
    }, [alerts]);

    let addAlert = (alert) => {
        let a = [...alerts];
        a.push(alert);
        setAlerts(a);
    }

    let removeAlert = (alerts, id) => {
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

    const beforeStompConnect = useCallback(function () {
        if (auth?.user?.access_token) {
            this.connectHeaders = {
                'Authorization': "Bearer " + auth.user.access_token
            }
        } else {
            this.connectHeaders = {}
        }
    }, [auth?.user?.access_token]);

    return (
        <StompSessionProvider
            url={`/api/sock/`}
            beforeConnect={beforeStompConnect}
        >
            <Router>
                <AlertRenderContext.Provider value={alerts}>
                    <AlertContext.Provider value={{
                        addAlert: addAlert,
                        removeAlert: removeAlert,
                        handleException: handleException,
                    }}>
                        <BaseLayout>
                            <ErrorBoundary>
                                <Switch>
                                    <Route path="/" exact component={Home}/>
                                    <Route path="/join" exact component={Join}/>
                                    {Config.enableusers && <Route path="/user/:name" component={UserPage}/>}
                                    {Config.showarchive && <Route path="/archiv/:page?" component={Archiv}/>}
                                    {Config.showstats && <Route path="/statistik" component={Stats}/>}
                                    <AdminRoute path="/debug" component={Debug}/>
                                    <AdminRoute path="/gapcloser" component={Gapcloser}/>
                                    <AdminRoute path="/import" component={Playlist}/>
                                    <AdminRoute path="/songs" component={Songs}/>
                                    <AdminRoute path="/users/:page?" component={UserList}/>
                                    <Route component={NoMatch}/>
                                </Switch>
                            </ErrorBoundary>
                        </BaseLayout>
                    </AlertContext.Provider>
                </AlertRenderContext.Provider>
            </Router>
        </StompSessionProvider>
    );
}

export default App;
