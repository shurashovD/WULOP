import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const ScoreboardPage = () => {
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [result, setResult] = useState([]);
    const [listner, setListner] = useState(false);
    const [step, setStep] = useState('OFF');
    const [task, setTask] = useState('0');

    const getResult = useCallback (async () => {
        try {
            const msgFromSrv = await request('/api/model/get-score', 'POST', {task}, { Authorization: `Bearer ${auth.token}` });
            setResult(msgFromSrv.result);
        }
        catch (e) {
            setStep('OFF');
        }
        setTimeout(() => {
            getResult();
        }, 10000);
    }, [request, auth.token, task]);

    useEffect(() => {
        if ( listner ) return;
        window.addEventListener('keypress', event => {
            if ( event.key === 'q' ) {
                setStep('I-LIPS');
                setTask(1);
            }
            if ( event.key === 'Q' ) {
                setStep('LIPS');
                setTask(1);
            }
            if ( event.key === 'w' ) {
                setStep('I-ARROW');
                setTask(2);
            }
            if ( event.key === 'W' ) {
                setStep('ARROW');
                setTask(2);
            }
            if ( event.key === 'e' ) {
                setStep('I-FEATH');
                setTask(3);
            }
            if ( event.key === 'E' ) {
                setStep('FEATH');
                setTask(3);
            }
            if ( event.key === 'r' ) {
                setStep('I-BLADING');
                setTask(4);
            }
            if ( event.key === 'R' ) {
                setStep('BLADING');
                setTask(4);
            }
            if ( event.key === 't' ) {
                setStep('I-HAIRS');
                setTask(5);
            }
            if ( event.key === 'T' ) {
                setStep('HAIRS');
                setTask(5);
            }
        });
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