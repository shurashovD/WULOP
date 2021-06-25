import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TasksContext } from '../context/TasksContext';
import { useHttp } from '../hooks/http.hook';

export const ScoreboardPage = () => {
    const auth = useContext(AuthContext);
    const tasks = useContext(TasksContext);
    const {request} = useHttp();
    const [step, setStep] = useState('OFF');
    const [task, setTask] = useState(null);

    useEffect(() => {
        document.querySelector('body').style.cursor = 'none';
        document.addEventListener('keydown', event => {
            if ( event.key === '1' ) {
                setTask(0);
                setStep('PRE');
            }
            if ( event.key === '2' ) {
                setTask(1);
                setStep('PRE');
            }
            if ( event.key === '3' ) {
                setTask(2);
                setStep('PRE');
            }
            if ( event.key === '4' ) {
                setTask(3);
                setStep('PRE');
            }
            if ( event.key === '5' ) {
                setTask(4);
                setStep('PRE');
            }
            if ( event.key === '0' ) {
                setStep('OFF');
            }
        });
    }, []);
    
    return(
        <div className="container-fluid min-vh-100 p-3">
            { (step !== 'OFF') && <h4 className="text-dark text-center container-fluid fw-bold fs-3">
                {(step === 'PRE') && <>Промежуточные результаты конкурса </> }
                "{ tasks[parseInt(task)]?.name }"
            </h4> }
            <div className="row bg-primary rounded py-2 text-white fw-bold">
                <span className="col-1 text-center">Место</span>
                <span className="col-2 text-center">Участник</span>
                <span className="col-7 text-center">Судьи/баллы</span>
                <span className="col-2 text-center">Сумма баллов</span>
            </div>
            <div className="row border border-primary rounded text-primary fw-bold mt-1">
                <span className="col-1 d-flex justify-content-center align-items-center border-end border-primary">1</span>
                <span className="col-2 d-flex justify-content-center align-items-center border-end border-primary">Иванова Наташа</span>
                <div className="col-7 border-end border-primary py-2 fw-normal">
                    <div className="row">
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                        <div className="col" style={{ width: '12.5%', display: 'flex', flexDirection: 'column' }}>
                            <span className="text-primary text-center lh-sm">Viktoriya Villecrose</span>
                            <span className="text-primary text-center">500</span>
                        </div>
                    </div>
                </div>
                <span className="col-2 d-flex justify-content-center align-items-center">2000</span>
            </div>
        </div>
    );
}