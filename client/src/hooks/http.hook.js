import { useCallback, useState } from "react"

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback (async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            if ( window.fetch ) {
                const response = await fetch(url, {
                    method, body, headers
                });
                const msgFromSrv = await response.text();

                try {
                    JSON.parse(msgFromSrv);
                }
                catch (e) {
                    console.log(msgFromSrv);
                    throw new Error('Invalid server response');
                }
                const data = JSON.parse(msgFromSrv);

                if ( !response.ok ) {
                    throw new Error(data.message || 'Что-то пошло не так...');
                }
                setLoading(false);

                return data;
            }
            else {
                const request = new XMLHttpRequest();
                request.open(method, url, true);
                for ( let key in headers ) request.setRequestHeader(key, headers[key]);
                request.send(body);

                const msgFromSrv = await new Promise((resolve, reject) => {
                    request.addEventListener('readystatechange', () => {
                        if (request.readyState !== 4) return
                        if (request.status === 200) resolve(request.response);
                        else throw new Error(request.statusText);
                    });
                });

                try {
                    JSON.parse(msgFromSrv);
                }
                catch (e) {
                    console.log(msgFromSrv);
                    throw new Error('Invalid server response');
                }
                const data = JSON.parse(msgFromSrv);

                setLoading(false);

                return data;
            }
        }
        catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const uplaodFile = useCallback (async (url, body, headers) => {
        try {
            const response = await fetch(url, {
                method: 'POST', body, headers
            });
            const msgFromSrv = await response.text();
            try { JSON.parse(msgFromSrv); }
            catch (e) {
                console.log(msgFromSrv);
            }
            return JSON.parse(msgFromSrv);
        }
        catch (e) {
            console.log(e);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, [setError]);

    return { loading, request, error, clearError, uplaodFile };
}