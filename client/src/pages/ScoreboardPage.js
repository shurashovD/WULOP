import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const ScoreboardPage = () => {
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [result, setResult] = useState([]);
    const [listner, setListner] = useState(false);
    const [step, setStep] = useState('OFF');

    const getResult = useCallback (async (task) => {
        try {
            const msgFromSrv = await request('/api/model/get-score', 'POST', {task}, { Authorization: `Bearer ${auth.token}` });
            setResult(msgFromSrv.result);
        }
        catch (e) {
            setStep('OFF');
        }
        setTimeout(() => {
            getResult(task);
        }, 10000);
    }, [request, auth.token]);

    useEffect(() => {
        if ( listner ) return;
        window.addEventListener('keypress', event => {
            if ( event.key === 'q' ) setStep('I-LIPS');
            if ( event.key === 'Q' ) setStep('LIPS');
            if ( event.key === 'w' ) setStep('I-ARROW');
            if ( event.key === 'W' ) setStep('ARROW');
            if ( event.key === 'e' ) setStep('I-FEATH');
            if ( event.key === 'E' ) setStep('FEATH');
            if ( event.key === 'r' ) setStep('I-BLADING');
            if ( event.key === 'R' ) setStep('BLADING');
            if ( event.key === 't' ) setStep('I-HAIRS');
            if ( event.key === 'T' ) setStep('HAIRS');
        })
        document.querySelector('body').style.cursor = 'none';
        document.querySelector('body').requestFullscreen();
        setListner(true);
    }, [listner]);

    useEffect(() => {

    }, [step]);
    
    return(
        <div>
            { (step === 'OFF') && <h1 className="yellow-text text-lighten-2 center mt-5">Приветствуем зрителей и участников конкурса</h1> }

        </div>
    );
}