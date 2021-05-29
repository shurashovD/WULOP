import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';
import startImg from '../img/Rfid-register.jpg';
import readImg from '../img/Rfid-read.gif';
import successImg from '../img/Rfid-success.gif';
import errorImg from '../img/Rfid-error.jpg';

export const RegisterRfidPage = () => {
    const toast = useToast();
    const auth = useContext(AuthContext);
    const startMessage = 'RFID-терминал';
    const readMessage = 'Пожалуйста, приложите карту';
    const verifyMessage = 'Карта прочитана. Пожалуйста, ждите...';
    const errorMessage = 'Системная ошибка';
    const successMessage = 'Выполнено';
    const [message, setMessage] = useState(startMessage);
    const [imgSrc, setImgSrc] = useState(startImg);
    const [preloader, setPreloader] = useState(false);
    const {request, error, clearError} = useHttp();
    const [step, setStep] = useState('OFF');

    const getStatus = useCallback (async () => {
        try {
            const msgFromSrv = await request('/api/device/status', 'GET', null, { Authorization: `Bearer ${auth.token}` });
            setStep(msgFromSrv?.status);
        }
        catch (e) {
            setStep('SYSERR');
        }
    }, [request, setStep, auth.token]);

    useEffect(() => {
        switch (step) {
            case 'OFF' : {
                setMessage(startMessage);
                setImgSrc(startImg);
                setPreloader(false);
                break;
            }
            case 'READ' : {
                setMessage(readMessage);
                setImgSrc(readImg);
                setPreloader(false);
                break;
            }
            case 'VERIFY' : {
                setMessage(verifyMessage);
                setPreloader(true);
                break;
            }
            case 'SUCCESS' : {
                setMessage(successMessage);
                setImgSrc(successImg);
                setPreloader(false);
                break;
            }
            case 'SYSERR' : {
                setMessage(errorMessage);
                setImgSrc(errorImg);
                setPreloader(false);
                break;
            }
            default : {
                setMessage(startMessage);
                setImgSrc(startImg);
                setPreloader(false);
                break;
            }
        }
    }, [step]);

    useEffect(() => {
        toast(error);
        clearError();
    }, [toast, error, clearError]);

    useEffect(() => {
        document.querySelector('input').focus();
    }, []);

    useEffect(() => {
        setInterval(() => {
            getStatus();
        }, 5000)
    }, [getStatus]);

    const blurHandler = event => event.target.focus();

    const pressHandler = async event => {
        if ( event.key === 'Enter' ) {
            const rfid = event.target.value;
            event.target.value = '';
            if ( step !== 'READ' ) return;

            if ( !isNaN(rfid) && rfid.length === 10 ) {
                setStep('VERIFY');
                await request('/api/device/slave-finish-read', 'POST', { rfid }, { Authorization: `Bearer ${auth.token}` });
            }
        }
    }

    return(
        <div className="row">
            <div className="col s12">
                <input type="text" onKeyPress={pressHandler} onBlur={blurHandler} focus="true" style={{width: '0'}}/>
                <h4 className="center-align blue-text text-darken-1">{message}</h4>
                <div className="col s6 offset-s3">
                    <img src={imgSrc} className="rfid-img" alt="Status"></img>
                </div>
            </div>
            <div className="col s2 offset-s5">
                { preloader && <Loader /> }
            </div>
        </div>
    );
}