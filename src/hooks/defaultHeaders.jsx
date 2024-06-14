import {useAuth} from "react-oidc-context";

function useDefaultHeaders() {
    const auth = useAuth();

    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "application/json");

    if (auth.isAuthenticated) {
        defaultHeaders.set("Authorization", "Bearer " + auth.user.access_token);
    }

    return defaultHeaders;
}

function withDefaultHeaders(Component) {
    return function WrappedComponent(props) {
        const defaultHeaders = useDefaultHeaders();
        return <Component {...props} defaultHeaders={defaultHeaders}/>;
    }
}

export default useDefaultHeaders;
export {useDefaultHeaders, withDefaultHeaders};