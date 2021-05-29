import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const ScoreboardPage = () => {
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [result, setResult] = useState([]);
    let listner = false;
    const [step, setStep] = useState('OFF');
    const [task, setTask] = useState('0');

    const getResult = useCallback (async () => {
        try {
            const msgFromSrv = await request('/api/model/get-score', 'POST', {task}, { Authorization: `Bearer ${auth.token}` });
            if ( msgFromSrv.result.length !== 0 ) setResult(msgFromSrv.result);
        }
        catch (e) {
            setStep('OFF');
        }
        if ( step === 'OFF' ) return;
        if ( step.split('-')[0] !== 'I' ) return;
        setTimeout(() => {
            getResult();
        }, 10000);
    }, [request, auth.token, task, step]);

    const Table = () => {
        const amount = (obj, fl) => {
            console.log(fl);
            let res = 0;
            obj.scores.forEach(item => {
                res += parseInt(item.score);
            });
            if ( fl ) res -= obj.hyhienical ?? 0;
            return res;
        }

        if ( result.length === 0 ) return null;

        const flag = (step.split('-')[0] === 'I') ? false : true;

        const sortResult = result.sort((a, b) => amount(b, flag) - amount(a, flag));

        const body = sortResult.map((model, index) => {
            return(
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{model.name}</td>
                    <td>{model.scores.find(item => item.referee === 'REFEREE-TABLE-1').score}</td>
                    <td>{model.scores.find(item => item.referee === 'REFEREE-TABLE-2').score}</td>
                    <td>{model.scores.find(item => item.referee === 'REFEREE-TABLE-3').score}</td>
                    <td>{model.scores.find(item => item.referee === 'REFEREE-TABLE-4').score}</td>
                    <td>{model.scores.find(item => item.referee === 'REFEREE-TABLE-5').score}</td>
                    <td>{model.scores.find(item => item.referee === 'REFEREE-TABLE-6').score}</td>
                    <td>{model.scores.find(item => item.referee === 'REFEREE-TABLE-7').score}</td>
                    <td>{(flag) ? model.hyhienical ?? 0 : '-'}</td>
                    <td>{amount(model, flag)}</td>
                </tr>
            );
        });

        return(
            <table className="centered indigo-text text-darken-4">
                <thead>
                    <tr>
                        <th>Место</th>
                        <th>Участник</th>
                        <th>1 судья</th>
                        <th>2 судья</th>
                        <th>3 судья</th>
                        <th>4 судья</th>
                        <th>5 судья</th>
                        <th>6 судья</th>
                        <th>7 судья</th>
                        <th>Гигиена</th>
                        <th>Итог</th>
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>

        );
    }

    useEffect(() => {
        if ( listner ) return;
        window.addEventListener('keypress', event => {
            if ( event.key === 'q' ) {
                setStep('I-LIPS');
                setTask(1);
            }
            if ( event.key === 'Q' ) {
                setStep('LIPS');
                setResult(result);
                setTask(1);
            }
            if ( event.key === 'w' ) {
                setStep('I-ARROW');
                setTask(2);
            }
            if ( event.key === 'W' ) {
                setStep('ARROW');
                setResult(result);
                setTask(2);
            }
            if ( event.key === 'e' ) {
                setStep('I-FEATH');
                setTask(3);
            }
            if ( event.key === 'E' ) {
                setStep('FEATH');
                setResult(result);
                setTask(3);
            }
            if ( event.key === 'r' ) {
                setStep('I-BLADING');
                setTask(4);
            }
            if ( event.key === 'R' ) {
                setStep('BLADING');
                setResult(result);
                setTask(4);
            }
            if ( event.key === 't' ) {
                setStep('I-HAIRS');
                setTask(5);
            }
            if ( event.key === 'T' ) {
                setStep('HAIRS');
                setResult(result);
                setTask(5);
            }
        });
        document.querySelector('body').style.cursor = 'none';
        document.querySelector('body').requestFullscreen();
        listner = true;
    }, []);

    useEffect(() => {
        getResult();
    }, [step, getResult]);
    
    return(
        <div>
            { (step === 'OFF') && <h1 className="yellow-text text-lighten-2 center mt-5">Приветствуем зрителей и участников конкурса</h1> }
            { (step === 'I-LIPS') && <h4 className="yellow-text text-lighten-2 center">Промежуточный зачет конкурса Эффект губной помады</h4> }
            { (step === 'LIPS') && <h4 className="yellow-text text-lighten-2 center">Результат конкурса Эффект губной помады</h4> }
            { (step === 'I-ARROW') && <h4 className="yellow-text text-lighten-2 center">Промежуточный зачет конкурса Стрелка с прокрасом межресничного пространства</h4> }
            { (step === 'ARROW') && <h4 className="yellow-text text-lighten-2 center">Результат конкурса Стрелка с прокрасом межресничного пространства</h4> }
            { (step === 'I-FEATH') && <h4 className="yellow-text text-lighten-2 center">Промежуточный зачет конкурса Растушевка</h4> }
            { (step === 'FEATH') && <h4 className="yellow-text text-lighten-2 center">Результат конкурса Растушевка</h4> }
            { (step === 'I-BLADING') && <h4 className="yellow-text text-lighten-2 center">Промежуточный зачет конкурса Микроблейдинг</h4> }
            { (step === 'BLADING') && <h4 className="yellow-text text-lighten-2 center">Результат конкурса Микроблейдинг</h4> }
            { (step === 'I-HAIRS') && <h4 className="yellow-text text-lighten-2 center">Промежуточный зачет конкурса Bолосковая техника</h4> }
            { (step === 'HAIRS') && <h4 className="yellow-text text-lighten-2 center">Результат конкурса Bолосковая техника</h4> }
            <Table />
        </div>
    );
}