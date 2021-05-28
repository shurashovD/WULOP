import {useState, useCallback, useEffect} from 'react';

const storageName = 'deviceData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [device, setDevice ] = useState(null);

    const login = useCallback((jwt, deviceName) => {
        setToken(jwt);
        setDevice(deviceName);

        localStorage.setItem(storageName, JSON.stringify({
            device, token
        }));
    }, [device, token]);

    const logout = useCallback(() => {
        setToken(null);
        setDevice(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        if ( data && data.token ) {
            login( data.token, data.device );
        }
    }, [login]);

    return { login, logout, device, token };
}