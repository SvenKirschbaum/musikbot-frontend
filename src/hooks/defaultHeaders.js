import {useKeycloak} from "@react-keycloak/web";
import globalKeycloak from "../keycloak";

function getHeadersFromKeycloak(instance) {
    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "application/json");

    if (instance.authenticated) {
        defaultHeaders.set("Authorization", "Bearer " + instance.token);
    }

    return defaultHeaders;
}

function useDefaultHeaders() {
    const {keycloak} = useKeycloak();

    return getHeadersFromKeycloak(keycloak);
}

function getDefaultHeaders() {
    return getHeadersFromKeycloak(globalKeycloak);
}

export default useDefaultHeaders;
export {useDefaultHeaders, getDefaultHeaders};