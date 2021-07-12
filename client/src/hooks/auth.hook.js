import {useState, useCallback, useEffect} from 'react';

const storageName = 'deviceData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [device, setDevice] = useState(null);
    const [description, setDescription] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [lang, setLang] = useState();

    const login = useCallback((jwt, deviceName, desc, id, lang) => {
        setDescription(desc);
        setToken(jwt);
        setDevice(deviceName);
        setDeviceId(id);
        setLang(lang);

        localStorage.setItem(storageName, JSON.stringify({
            token: jwt, deviceName, description: desc, id, lang
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setDevice(null);
        setDescription(null);
        setDeviceId(null);
        setLang(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        if ( data && data.token ) {
            const { token, deviceName, description, id, lang } = data;
            login( token, deviceName, description, id, lang );
        }
    }, [login]);

    return { login, logout, device, token, description, deviceId, lang };
}