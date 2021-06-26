import React, { useContext } from 'react';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';
import { RefereeContext } from '../context/referee/RefereeContext';
import { TasksContext } from '../context/tasks/TasksContext';
import microphoneImg from '../img/microphone.svg';

export const RefereeMain = () => {
    const { tasks } = useContext(TasksContext);
    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;
    const { refereeState, scoreChangeHandler, recBtnHandler, readyBtnHandler, cancelBtnHandler, photoBtnHandler } = useContext(RefereeContext);
    const { audio, model, scores, record, micBusy, sources, amount, invalid } = refereeState;

    const numberValidator = event => {
        if ( event.key === 'Backspace' ) return;
        if ( isNaN(event.key) ) event.preventDefault();
    }

    return (
        <div className="container mt-3">
            <div className="container d-flex justify-content-center align-items-center mb-3">
                <span className="text-primary fs-3 me-4">
                    {dg('participant')} №{model.number}. {dg('category')}: "{tasks[model.task-1].name}"
                </span>
                <button
                    className="btn btn-primary btn-shadow text-white text-uppercase col-2"
                    disabled={ !model || (!Boolean(model?.beforePhoto) && !Boolean(model?.afterPhoto)) || ((model?.beforePhoto === '') && (model?.afterPhoto === '')) }
                    onClick={photoBtnHandler}
                >
                    Фото
                </button>
            </div>
            <div className="row">
                <div className="col-7 bg-secondary rounded shadow d-flex">
                    <p className="w-25 border-end border-primary text-white text-center m-0 p-2">{dg('criteria')}</p>
                    <p className="w-75 text-white text-center m-0 p-2">{dg('descriptionOfTheEvaluationCriteria')}</p>
                </div>
                <div className="col-2">
                    <p className="bg-secondary rounded shadow text-white text-center p-2 m-0">{dg('pointsFromTo')}</p>
                </div>
                <div className="col-3">
                    <p className="bg-secondary rounded shadow text-white text-center p-2 m-0">{dg('comment')}</p>
                </div>
            </div>
            {
                tasks[model.task-1].list.map(item => {
                    return (
                        <div className="row border-bottom border-primary d-flex align-items-stretch" key={item.id}>
                            <div className="col-7 d-flex">
                                <p className="w-25 border-end border-primary text-primary text-center m-0 p-2" style={{ fontSize: '12px' }}>{item.test}</p>
                                <p className="w-75 text-primary m-0 p-2" style={{ fontSize: '12px' }}>{item.dect}</p>
                            </div>
                            <div className="col-2 d-flex">
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
                            <div className="col-3 d-flex align-items-center justify-content-between p-0">
                                {audio && <button
                                    className="btn btn-primary btn-shadow text-white container p-1 col-3"
                                    name={item.id}
                                    onClick={recBtnHandler}
                                >
                                    { (record && (micBusy === item.id)) && <div className="spinner-grow spinner-grow-sm text-danger" /> }
                                    { (micBusy !== item.id) && <img src={microphoneImg} width="20" alt="record" /> }
                                    { (!record && (micBusy === item.id)) && <div className="spinner-border spinner-border-sm" /> }
                                </button>}
                                <audio
                                    src={sources.get(item.id)}
                                    controls
                                    style={{ padding: 0, width: '187px' }}/>
                            </div>
                        </div>
                    );
                })
            }
            <div className="row mb-3">
                <p className="col-7 text-end text-dark text-uppercase fs-3">{dg('totalPoints')}:</p>
                <p className="col-2 text-center text-dark fs-3 fw-bold">{amount}</p>
            </div>
            <div className="row mb-5">
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