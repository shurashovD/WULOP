import React, { useCallback, useContext, useEffect, useReducer } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMicrophone } from '../../hooks/microphone.hook'
import { AuthContext } from '../AuthContext'
import { ModalContext } from '../modal/modalContext'
import { TasksContext } from '../tasks/TasksContext'
import { PreviousContext } from './PreviousContext'
import { previousReducer } from './previousReducer'
import { PREV_REFEREE_SET_AUDIO, PREV_REFEREE_SET_COMMENT_SRC, PREV_REFEREE_SET_INVALID, PREV_REFEREE_SET_LOADING, PREV_REFEREE_SET_MIC_BUSY, PREV_REFEREE_SET_MODEL, PREV_REFEREE_SET_REC, PREV_REFEREE_SET_SCORE } from './types'

export const PreviousState = ({children}) => {
    const { request, uplaodFile } = useHttp()
    const auth = useContext(AuthContext)
    const { tasks } = useContext(TasksContext)
    const { show } = useContext(ModalContext)
    const { recording, track, mic, start, stop } = useMicrophone()

    const [state, dispatch] = useReducer(previousReducer, {
        audio: null,
        loading: false,
        invalid: false,
        model: null,
        record: false,
        micBusy: false,
        scores: new Map()
    })

    const getModel = useCallback( async rfid => {
        dispatch({ type: PREV_REFEREE_SET_LOADING });
        try {
            const msgFromSrv = await request('/api/model/get-model', 'POST', { rfid }, { Authorization: `Bearer ${auth.token}` })
            const model = JSON.parse(msgFromSrv.model)
            const newScores = new Map(tasks[model.task - 1].preCriterion.map(item => [item.id, model.prevScore.find(score => score.testId === item.id)?.value ?? 0]))
            dispatch({ type: PREV_REFEREE_SET_SCORE, payload: newScores })
            dispatch({ type: PREV_REFEREE_SET_MODEL, model })
            dispatch({ type: PREV_REFEREE_SET_LOADING })
        }
        catch (e) {
            dispatch({ type: PREV_REFEREE_SET_LOADING });
            show(e.message, 'error');
        }
    }, [request, auth.token, show, tasks]);

    const rfidCallback = rfid => getModel(rfid)

    const scoreChangeHandler = event => {
        let value = event.target.value
        if ( isNaN(value) ) value = 0
        if ( value > 100 ) value = 100
        const newScores = new Map()
        for ( let [key, item] of state.scores.entries() ) {
            if ( +key === +event.target.name ) {
                newScores.set(key, value)
            }
            else {
                newScores.set(key, item)
            }
        }
        dispatch({ type: PREV_REFEREE_SET_SCORE, payload: newScores })
    }
    
    const cancelBtnHandler = () => dispatch({ type: PREV_REFEREE_SET_MODEL, model: null })

    const validationData = () => {
        for (let value of tasks[state.model.task - 1].preCriterion) {
            if ( !Boolean(state.model.prevScore.find(item => +item.testId === +value.id)) ) {
                dispatch({ type: PREV_REFEREE_SET_INVALID, payload: true })
                setTimeout(() => {
                    dispatch({ type: PREV_REFEREE_SET_INVALID, payload: false })
                }, 1000)
                return true
            }
        }
        return false
    }

    const readyBtnHandler = async () => {
        if (validationData()) return
        dispatch({ type: PREV_REFEREE_SET_LOADING })
        try {
            const { model } = state
            const msgFromSrv = await request('/api/model/save-previous-score', 'POST', { model },
                { Authorization: `Bearer ${auth.token}` }
            );
            show(msgFromSrv.message)
            dispatch({ type: PREV_REFEREE_SET_MODEL, model: null })
            dispatch({ type: PREV_REFEREE_SET_LOADING })
        }
        catch (e) {
            show(e.message, 'error')
            dispatch({ type: PREV_REFEREE_SET_LOADING })
        }
    }

    const recBtnHandler = () => {
        if ( state.micBusy ) {
            if ( recording ) stop()
            return
        }

        dispatch({ type: PREV_REFEREE_SET_MIC_BUSY, payload: true })
    }

    const resetState = () => dispatch({ type: PREV_REFEREE_SET_MODEL, model: null })

    const sendComment = useCallback( async track => {
        const file = new File([track], `${auth.description}_${performance.now()}.webm`);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const msgFromSrv = await uplaodFile('/api/model/referee-comment', formData, { Authorization: `Bearer ${auth.token}` })
            dispatch({ type: PREV_REFEREE_SET_COMMENT_SRC, payload: msgFromSrv.path })
            dispatch({ type: PREV_REFEREE_SET_MIC_BUSY, payload: false })
        }
        catch (e) {
            dispatch({ type: PREV_REFEREE_SET_MIC_BUSY, payload: false })
            console.log(e);
            show(e.message, 'error');
        }
        return true;
    }, [auth.description, uplaodFile, auth.token, show])

    useEffect(() => {
        dispatch({type: PREV_REFEREE_SET_AUDIO, payload: mic})
    }, [mic])

    useEffect(() => {
        if ( state.micBusy ) start()
    }, [state.micBusy, start])

    useEffect(() => {
        dispatch({ type: PREV_REFEREE_SET_REC, payload: recording })
    }, [recording])

    useEffect(() => {
        if ( track && auth.description ) {
            sendComment(track)
        }
    }, [track, sendComment])

    return (
        <PreviousContext.Provider value={{prevRefereeState: state, rfidCallback, scoreChangeHandler, cancelBtnHandler, readyBtnHandler, recBtnHandler, resetState}}>
            {children}
        </PreviousContext.Provider>
    )
}