import {useEffect} from "react";

export function Join() {
    useEffect(() => {
        window.location.href = "https://discord.com/oauth2/authorize?client_id=935283302707920968";
    }, []);

    return null;
}