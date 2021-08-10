import React, { useContext, useEffect } from 'react';
import { NavBar } from '../components/Navbar';
import { HyhienicalContext } from '../context/hyhienical/hyhienicalContext';
import { Loader } from '../components/Loader';
import { TasksContext } from '../context/tasks/TasksContext';
import microphoneImg from '../img/microphone.svg';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';

export const HyhienicPage = () => {
    const { tasks } = useContext(TasksContext);
    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;
    const { hyhienicState, initAudio, setNumber, setRecord, setHyhienicalScore, readyHandler, resetState } = useContext(HyhienicalContext);
    const { number, model, modelLoading, record, updateRecord, audio, loading } = hyhienicState;

    const numberValidator = event => {
        if ( event.key === 'Backspace' ) return;
        if ( event.key === ' ' ) event.preventDefault();
        if ( event.target.value.length === 3 ) event.preventDefault();
        if ( (event.target.value.length === 0) && (event.key === '0') ) event.preventDefault();
        if ( isNaN(event.key) ) event.preventDefault();

        if ( (event.target.name === 'score') && ( event.target.value === '0' ) ) {
            event.target.value = '';
        }

        if ( (event.target.name === 'score') && (parseInt(event.target.value + event.key) > 100) ) {
            event.preventDefault();
            event.target.value = 100;
        }
    }

    const recBtnHandler = () => {
        record ? audio.stop() : audio.start();
        setRecord();
    }

    useEffect(initAudio, [initAudio]);

    useEffect(() => {
        return resetState
    }, [])

    return(
        <div className="container d-flex flex-column justify-content-start">
            { loading && <Loader /> }
            <NavBar />
            <p className="text-dark fw-bold text-center mt-4">{dg('hygienist')}</p>
            <p className="text-dark text-center mt-3">{dg('enterTheParticipantNumber')}</p>
            <div className="row">
                <div className="col-2 mx-auto">
                    <input
                        type="text"
                        className="form-control text-center"
                        value={number}
                        onKeyDown={numberValidator}
                        onChange={setNumber}
                    />
                </div>
            </div>
            { !model && <p className="text-dark text-center mt-3">- - -</p> }
            { model && <p className="text-dark text-center fs-3 mt-3">{dg('participant')}: №{model.number}. {dg('category')}: “{tasks[model.task-1].name}”</p> }
            { model &&
                tasks[model.task-1].hyhienicCriterion.map(item => {
                    return (<div className="row" key={item.id}>
                        <div className="col-2 mx-auto" key={item.id}>
                            <p className="text-dark text-center mt-3 mb-0">{item.test}</p>
                            <input
                                type="text"
                                name="score"
                                className="form-control text-center"
                                value={model?.hyhienicalScore?.find(el => el.testId === item.id)?.value ?? 0}
                                onKeyDown={numberValidator}
                                onChange={event => setHyhienicalScore({event, testId: item.id})}
                            />
                        </div>
                    </div>)
                })}
            { model && (<div className="row mt-4">
                <div className="col-2 mx-auto">
                    <button
                        className="btn btn-primary btn-shadow text-white text-uppercase container"
                        onClick={recBtnHandler}
                    >
                        { (record && !updateRecord) && <div className="spinner-grow spinner-grow-sm" /> }
                        { (!record && !updateRecord) && <img src={microphoneImg} width="20" alt="record" /> }
                        { updateRecord && <div className="spinner-border spinner-border-sm" /> }
                    </button>
                </div>
            </div>) }
            <div className="row mt-4">
                { model?.hyhienicalComment && (<div className="col-6 mx-auto">
                    <audio controls src={ model.hyhienicalComment } className="container" />
                </div>) }
            </div>
            { modelLoading && <div className="spinner-border text-primary m-auto"></div> }
            { model && <div className="row mt-5 mb-3">
                <div className="col-2 mx-auto">
                    <button
                        className="btn btn-primary btn-shadow text-white text-uppercase container"
                        onClick={readyHandler}
                    >
                        {dg('done')}
                    </button>
                </div>
            </div> }
        </div>
    );
}