import React, { useContext, useEffect, useState } from 'react';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';
import { ScoreboardContext } from '../context/scoreboard/scoreboardContext';
import { TasksContext } from '../context/tasks/TasksContext';

export const ScoreboardPage = () => {
    const dictionary = useContext(DictionaryContext);
    const { dg } = dictionary;
    const { tasks } = useContext(TasksContext);
    const { scoreboardState, eventListenerCallback } = useContext(ScoreboardContext);
    const {mode, task, result} = scoreboardState;
    const [keyDownEvent, setKeyDownEvent] = useState(null);

    useEffect(() => {
        function keyDownEventHandler(event) {
            setKeyDownEvent(event);
        }
        document.addEventListener('keydown', keyDownEventHandler);
        document.querySelector('body').style.cursor = 'none';
        return () => {
            document.querySelector('body').style.cursor = 'default';
            document.removeEventListener('keydown', keyDownEventHandler);
        }
    }, []);

    useEffect(() => {
        if ( keyDownEvent ) {
            setKeyDownEvent(null);
            eventListenerCallback(keyDownEvent);
        }
    }, [keyDownEvent, eventListenerCallback]);

    return(
        <div className="container-fluid min-vh-100 p-3">
            { (mode !== 'OFF') && <h4 className="text-dark text-center container-fluid fw-bold fs-3">
                { (mode === 'PRE') && <>{dg('intermediateResultOfCompetition')} </> }
                { (mode === 'RES') && <>{dg('resultOfContest')} </> }
                "{ tasks[parseInt(task)]?.name }"
            </h4> }
            { (result.length !== 0) && <div className="row bg-primary rounded py-2 text-white fw-bold">
                <span className="col-1 text-center">{dg('place')}</span>
                <span className="col-2 text-center">{dg('participant')}</span>
                <span className="col-7 text-center">{dg('points')}</span>
                <span className="col-2 text-center">{dg('totalPoints')}</span>
            </div> }
            {
                result.map((item, index) => {
                    const { team, scoresResult, total } = item
                    return (
                        <div className="row border border-primary rounded text-primary fw-bold mt-1" key={index}>
                            <span className="col-1 d-flex justify-content-center align-items-center border-end border-primary">{index + 1}</span>
                            <span className="col-2 d-flex justify-content-center align-items-center border-end border-primary">{team}</span>
                            <div className="col-7 border-end border-primary py-2 fw-normal">
                                <div className="row">
                                    {
                                        scoresResult.map((score, i, arr) => {
                                            return (
                                                <div
                                                    className="col"
                                                    style={{ width: 100 / arr.length + '%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                                    key={String(index) + String(i)}
                                                >
                                                    <span className="text-primary text-center lh-sm">{score.referee}</span>
                                                    <span className="text-primary text-center">{score.amount}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <span className="col-2 d-flex justify-content-center align-items-center">{total}</span>
                        </div>
                    );
                })
            }
        </div>
    );
}