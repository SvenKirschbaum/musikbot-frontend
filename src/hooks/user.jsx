import md5 from "md5";
import {useAuth} from "react-oidc-context";

function useUser() {
    const auth = useAuth();


    if (!auth.isAuthenticated) return false;

    let user = {};

    user.name = auth.user.profile.preferred_username;
    user.email = auth.user.profile.email;
    user.gravatarId = md5(auth.user.profile.email);
    user.admin = auth.user.profile.resource_access[import.meta.env.VITE_BACKEND_CLIENT_ID]?.roles?.includes("admin") ?? false;

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