import {StrictMode, useCallback, useEffect, useRef, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
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
import {RequireAdmin} from "./components/Routes";
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
        if (!auth.isAuthenticated) auth.signinSilent();
    }, []);

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

    if (auth.isLoading) return (<div>Loading...</div>);

    return (
        <StompSessionProvider
            url={`/api/sock/`}
            beforeConnect={beforeStompConnect}
        >
            <Router
                future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                    v7_fetcherPersist: true,
                    v7_normalizeFormMethod: true,
                    v7_partialHydration: true,
                    v7_skipActionStatusRevalidation: true,
                }}
            >
                <AlertRenderContext.Provider value={alerts}>
                    <AlertContext.Provider value={{
                        addAlert: addAlert,
                        removeAlert: removeAlert,
                        handleException: handleException,
                    }}>
                        <BaseLayout>
                            <ErrorBoundary>
                                <Routes>
                                    <Route path="/" exact element={<Home/>}/>
                                    <Route path="/join" exact element={<Join/>}/>
                                    {Config.enableusers && <Route path="/user/:name/*" element={<UserPage/>}/>}
                                    {Config.showarchive && <Route path="/archiv/:page?" element={<Archiv/>}/>}
                                    {Config.showstats && <Route path="/statistik/*" element={<Stats/>}/>}
                                    <Route path="/debug" element={<RequireAdmin><Debug/></RequireAdmin>}/>
                                    <Route path="/gapcloser" element={<RequireAdmin><Gapcloser/></RequireAdmin>}/>
                                    <Route path="/import" element={<RequireAdmin><Playlist/></RequireAdmin>}/>
                                    <Route path="/songs" element={<RequireAdmin><Songs/></RequireAdmin>}/>
                                    <Route path="/users/:page?" element={<RequireAdmin><UserList/></RequireAdmin>}/>
                                    <Route component={NoMatch}/>
                                </Routes>
                            </ErrorBoundary>
                        </BaseLayout>
                    </AlertContext.Provider>
                </AlertRenderContext.Provider>
            </Router>
        </StompSessionProvider>
    );
}

export default App;
