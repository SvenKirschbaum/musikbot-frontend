import {useKeycloak} from "@react-keycloak/web";
import md5 from "md5";

function useUser() {
    const {keycloak} = useKeycloak();


    if (!keycloak.authenticated) return false;

    let user = {};

    user.name = keycloak.tokenParsed.preferred_username;
    user.email = keycloak.tokenParsed.email;
    user.gravatarId = md5(keycloak.tokenParsed.email);
    user.admin = keycloak.hasResourceRole("admin", "musikbot-backend");

    return user;
}

function withUser(Component) {
    return function WrappedComponent(props) {
        const user = useUser();
        return <Component {...props} user={user}/>;
    }
}

export default useUser;
export {useUser, withUser};