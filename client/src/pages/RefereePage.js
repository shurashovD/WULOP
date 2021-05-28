import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';

const ReadyBtn = props => {
    return (
        <div className="row center">
            <button className="waves-effect waves-light btn-large col s4 offset-s4" onClick={props.onClick}>Начать</button>
        </div>
    );
}

const WaitRfid = () => {
    return (
        <div>
            <h5 className="teal-text text-accent-4 center mb-5">
                Дождитесь приглашения на табло участника и приложите метку...
            </h5>
            <Loader />
        </div>
    );
}

export const RefereePage = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const toast = useToast();
    const {request} = useHttp();
    const [step, setStep] = useState('OFF');

    const getStatus = useCallback (async () => {
        try {
            const msgFromSrv = await request('/api/device/status', 'GET', null, { Authorization: `Bearer ${auth.token}` });
            if (msgFromSrv?.status !== 'SUCCESS') {
                setTimeout(getStatus, 2000);
                return;
            }

            const rfid = msgFromSrv.value;
            const data = await request('/api/model/get-model', 'POST', { rfid }, { Authorization: `Bearer ${auth.token}` });
            if ( data?.model ) {
                const model = JSON.parse(data.model)[0];
                let path = null;
                switch (model.task) {
                    case '1' : {
                        path = '/lips';
                        break;
                    }
                    case '2' : {
                        path = '/arrow';
                        break;
                    }
                    case '3' : {
                        path = '/feathering';
                        break;
                    }
                    case '4' : {
                        path = '/microblading';
                        break;
                    }
                    case '5' : {
                        path = '/hair';
                        break;
                    }
                    default : path = null;
                }
                if ( path ) {
                    history.push(path);
                    return;
                }
            }
            throw new Error('Ошибка получения участника');
        }
        catch (e) {
            toast(e);
            setStep('OFF');
        }
    }, [request, auth.token, toast, history]);

    const readInit = useCallback (async () => {
        try {
            await request('/api/device/master-init-read', 'POST', null, { Authorization: `Bearer ${auth.token}` });
            getStatus();
        }
        catch (e) {}
    }, [request, auth.token, getStatus]);

    useEffect(() => {
        switch (step) {
            case 'OFF' : {
                break;
            }
            case 'WAIT-RFID' : {
                readInit();
                break;
            }
            default : {
                break;
            }
        }
    }, [step, readInit]);

    return(
        <div>
            {(step === 'OFF') && <ReadyBtn onClick={() => setStep('WAIT-RFID')} />}
            {(step === 'WAIT-RFID')  && <WaitRfid />}
        </div>
    );
}