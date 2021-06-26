import React, { useCallback, useContext, useEffect, useReducer } from "react";
import { RefereeContext } from "./RefereeContext";
import { refereeReducer } from "./refereeReducer";
import { useHttp } from "../../hooks/http.hook";
import { REFEREE_SET_INVALID, REFEREE_SET_LOAD, REFEREE_SET_MEDIA, REFEREE_SET_MIC_BUSY, REFEREE_SET_MODEL, REFEREE_SET_PHOTO, REFEREE_SET_REC, REFEREE_SET_SCORES, REFEREE_SET_SRC, REFEREE_SET_UPDREC } from "./types";
import { AuthContext } from "../AuthContext";
import { ModalContext } from "../../context/modal/modalContext";
import { TasksContext } from "../tasks/TasksContext";
import { useMicrophone } from "../../hooks/microphone.hook";

export const RefereeState = ({children}) => {
    const auth = useContext(AuthContext);
    const { tasks } = useContext(TasksContext);
    const { show } = useContext(ModalContext);
    const { request, uplaodFile } = useHttp();
    const { mic, start, recording, stop, track } = useMicrophone();
    const [state, dispatch] = useReducer(refereeReducer, {
        audio: null,
        model: null,
        loading: false,
        micBusy: null,
        record: false,
        scores: new Map(),
        amount: 0,
        sources: new Map(),
        invalid: false,
        photo: false
    });

    const getModel = useCallback( async rfid => {
        dispatch({ type: REFEREE_SET_LOAD });
        try {
            const msgFromSrv = await request('/api/model/get-model', 'POST', { rfid }, { Authorization: `Bearer ${auth.token}` });
            const model = JSON.parse(msgFromSrv.model);
            const scores = new Map(
                tasks[model.task-1].list.map(item => {
                    const key = item.id;
                    const value = model.scores
                        ?.find(el => String(el.refereeId) === String(auth.id))?.refereeScores
                        .find(el => String(el.testId) === String(key))?.value ?? '';
                    return [key, value];
                })
            );
            const record = new Map(
                tasks[model.task-1].list.map(item => [item.id, false])
            );
            const updateRecord = new Map(
                tasks[model.task-1].list.map(item => [item.id, false])
            );
            const sources = new Map(
                tasks[model.task-1].list.map(item => {
                    const key = item.id;
                    const value = model.scores
                        ?.find(el => String(el.refereeId) === String(auth.id))?.refereeScores
                        .find(el => String(el.testId) === String(key))?.commentLink ?? '';
                    return [key, value];
                })
            );
            const amount = model.scores?.find(item => String(item.refereeId) === String(auth.id))?.amount ?? 0;
            dispatch({ type: REFEREE_SET_SCORES, scores, amount });
            dispatch({ type: REFEREE_SET_REC, record });
            dispatch({ type: REFEREE_SET_UPDREC, updateRecord });
            dispatch({ type: REFEREE_SET_SRC, sources });
            dispatch({ type: REFEREE_SET_MODEL, model });
            dispatch({ type: REFEREE_SET_LOAD });
        }
        catch (e) {
            dispatch({ type: REFEREE_SET_LOAD });
            show(e.message, 'error');
        }
    }, [request, auth.token, auth.id, show, tasks]);

    const scoreChangeHandler = event => {
        let value = event.target.value;
        if ( value === '' ) value = 0;
        if ( value > 100 ) value = 100;
        const newScores = new Map( state.scores );
        newScores.set(parseInt(event.target.name), parseInt(value));

        let newAmount = 0;
        for ( let pair of newScores ) {
            if ( pair[1] === '' ) continue;
            newAmount += parseInt(pair[1]);
        }
        dispatch({ type: REFEREE_SET_SCORES, scores: newScores, amount: newAmount });
    }

    const rfidCallback = rfid => getModel(rfid);

    const sendComment = useCallback( async () => {
        if ( !track ) return;
        const file = new File([track], `${auth.description}_${performance.now()}.webm`);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const msgFromSrv = await uplaodFile('/api/model/referee-comment', formData, { Authorization: `Bearer ${auth.token}` });
            const newSources = new Map( state.sources );
            newSources.set(state.micBusy, msgFromSrv.path);
            dispatch({ type: REFEREE_SET_SRC, sources: newSources });
            dispatch({ type: REFEREE_SET_MIC_BUSY, value: null });
        }
        catch (e) {
            dispatch({ type: REFEREE_SET_MIC_BUSY, value: null });
            console.log(e);
            show(e.message, 'error');
        }
        return true;
    }, [track, auth.description, auth.token, uplaodFile, state.sources, state.micBusy, show]);

    const recBtnHandler = event => {
        const targetName = parseInt(
            event.nativeEvent
            .composedPath()
            .find(item => item.tagName === 'BUTTON').name
        );

        if ( state.micBusy ) {
            if ( state.micBusy !== targetName ) return;
            if ( recording ) stop();
            return;
        }

        dispatch({ type: REFEREE_SET_MIC_BUSY, value: targetName });
    }

    const validationData = () => {
        for ( let pair of state.scores ) {
            if ( pair[1] === '' ) {
                dispatch({ type: REFEREE_SET_INVALID, value: true });
                setTimeout(() => {
                    dispatch({ type: REFEREE_SET_INVALID, value: false });
                }, 1000);
                return true;
            }
        }
        return false;
    }

    const readyBtnHandler = async () => {
        if ( validationData() ) return;
        dispatch({ type: REFEREE_SET_LOAD });
        try {
            const { model, scores, amount, sources } = state;
            const refereeScores = [];
            for ( let [key, value] of scores ) refereeScores.push({
                commentLink: sources.get(key) ?? '',
                testId: key,
                value
            });
            const msgFromSrv = await request('/api/model/save-score', 'POST', {
                modelId: model._id,
                amount, 
                refereeId: auth.id,
                refereeScores: JSON.stringify(refereeScores)
            }, { Authorization: `Bearer ${auth.token}` });
            show(msgFromSrv.message);
            dispatch({ type: REFEREE_SET_LOAD });
            dispatch({ type: REFEREE_SET_MODEL, model: null });
        }
        catch (e) {
            show(e.message, 'error');
            dispatch({ type: REFEREE_SET_LOAD });
        }
    }

    const cancelBtnHandler = () => {
        dispatch({ type: REFEREE_SET_MODEL, value: null });
        dispatch({ type: REFEREE_SET_SCORES, scores: new Map() });
        dispatch({ type: REFEREE_SET_SRC, sources: new Map() });
    }

    const photoBtnHandler = () => dispatch({ type: REFEREE_SET_PHOTO, value: true });

    const photoCloseHandler = () => dispatch({ type: REFEREE_SET_PHOTO, value: false });

    useEffect(() => {
        dispatch({ type: REFEREE_SET_MEDIA, audio: mic });
    }, [mic]);

    useEffect(() => {
        if ( state.micBusy ) start();
    }, [state.micBusy, start]);

    useEffect( () => {
        dispatch({ type: REFEREE_SET_REC, record: recording });
    }, [recording]);

    useEffect( useCallback(sendComment, [sendComment]), [track] );

    return (
        <RefereeContext.Provider value={{
            refereeState: state,
            rfidCallback, scoreChangeHandler, recBtnHandler, readyBtnHandler, cancelBtnHandler, photoBtnHandler, photoCloseHandler
        }}>
            {children}
        </RefereeContext.Provider>
    );
}