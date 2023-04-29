import {useEffect} from "react";

const useLocalStorage = (storageKey, initialValue) => {
    const storageValue = localStorage.getItem(storageKey);
    const [value, setValue] = useState(storageValue ? storageValue : initialValue);

    useEffect(() => {
        localStorage.setItem(storageKey, value);
    }, [value]);

    return [value, setValue];
}

const useSessionStorage = (storageKey, initialValue) => {
    const storageValue = sessionStorage.getItem(storageKey);
    const [value, setValue] = useState(storageValue ? storageValue : initialValue);

    useEffect(() => {
        sessionStorage.setItem(storageKey, value);
    }, [value]);

    return [value, setValue];
}

export default {useLocalStorage, useSessionStorage};