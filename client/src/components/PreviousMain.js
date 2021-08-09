import React, { useContext, useEffect } from 'react'
import { DictionaryContext } from '../context/dictionary/dictionaryContext';
import { PreviousContext } from '../context/previous/PreviousContext';
import { TasksContext } from '../context/tasks/TasksContext';
import microphoneImg from '../img/microphone.svg'

export const PreviousMain = () => {
    const { dg } = useContext(DictionaryContext)
    const { prevRefereeState, scoreChangeHandler, cancelBtnHandler, readyBtnHandler, recBtnHandler, resetState } = useContext(PreviousContext)
    const { audio, model, invalid, record, micBusy, scores } = prevRefereeState
    const { tasks } = useContext(TasksContext)

    const numberValidator = event => {
        if ( event.key === 'Backspace' ) return
        if ( isNaN(event.key) ) event.preventDefault()
    }

    useEffect(() => {
        return resetState
    }, [])

    return (
        <div className="container pt-3 min-vh-100 d-flex flex-column">
            <div className="container d-flex justify-content-center align-items-center mb-3">
                <span className="text-primary fs-3 me-4">
                    {dg('participant')} №{model.number}. {dg('category')}: "{tasks[model.task-1].name}"
                </span>
            </div>
            <div className="row">
                <div className="col-9 bg-secondary rounded shadow">
                    <p className="border-primary text-white text-center m-0 p-2">{dg('criteria')}</p>
                </div>
                <div className="col-3">
                    <p className="bg-secondary rounded shadow text-white text-center p-2 m-0">{dg('pointsFromTo')}</p>
                </div>
            </div>
            {
                tasks[model.task-1].preCriterion.map(item => {
                    return (
                        <div className="row border-bottom border-primary" key={item.id}>
                            <div className="col-9 d-flex">
                                <p className="text-primary text-center m-auto">{item.test}</p>
                            </div>
                            <div className="col-3 d-flex">
                                <div className="row my-auto">
                                    <div className="col-6 mx-auto p-2">
                                        <input
                                            type="text"
                                            className={"form-control bg-transparent border-1 text-center fs-3 p-1 " + ( invalid && "border-danger" )}
                                            name={item.id}
                                            value={scores.get(item.id)}
                                            onKeyDown={numberValidator}
                                            onChange={scoreChangeHandler}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
            <div className="row mb-3">
                <p className="col-9 text-end text-dark text-uppercase fs-3">{dg('totalPoints')}:</p>
                <p className="col-3 text-center text-dark fs-3 fw-bold">{model.prevScore.reduce((sum, item) => sum + parseInt(item.value || 0), 0)}</p>
            </div>
            <div className="row">
                <div className="col-2 mx-auto">
                    {audio && <button
                        className="btn btn-primary btn-shadow text-white container"
                        onClick={recBtnHandler}
                    >
                        { record && <div className="spinner-grow spinner-grow-sm text-danger" /> }
                        { (!record && !micBusy)  && <img src={microphoneImg} width="20" alt="record" /> }
                        { (!record && micBusy) && <div className="spinner-border spinner-border-sm" /> }
                    </button>}
                </div>
            </div>
            {Boolean(model.prevComment) && <div className="row mt-4">
                <div className="col-6 mx-auto">
                    <audio controls src={model.prevComment} className="container" />
                </div>
            </div>}
            <div className="row mb-5 mt-auto">
                <button
                    className="btn btn-primary btn-shadow text-white text-uppercase mx-auto col-2"
                    onClick={readyBtnHandler}
                >
                    {dg('done')}
                </button>
                <button
                    className="btn btn-primary btn-shadow text-white text-uppercase mx-auto col-2"
                    onClick={cancelBtnHandler}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}