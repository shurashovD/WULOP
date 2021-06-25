import {useState, useCallback, useEffect} from 'react';

const storageName = 'deviceData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [device, setDevice] = useState(null);
    const [description, setDescription] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    const login = useCallback((jwt, deviceName, desc, id) => {
        setDescription(desc);
        setToken(jwt);
        setDevice(deviceName);
        setDeviceId(id);

        localStorage.setItem(storageName, JSON.stringify({
            token: jwt, deviceName, description: desc, id
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setDevice(null);
        setDescription(null);
        setDeviceId(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        if ( data && data.token ) {
            login( data.token, data.deviceName, data.description, data.id );
        }
    }, [login]);

    return { login, logout, device, token, description, deviceId };
}