import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../AuthContext';
import { ScoreboardContext } from './scoreboardContext';
import { scoreboardReducer } from './scoreboardReducer';
import { SCOREBOARD_SET_INTERVAL, SCOREBOARD_SET_RESULT, SCOREBOARD_SET_TASK } from './types';

export const ScoreboardState = ({children}) => {
    const auth = useContext(AuthContext);
    const { request } = useHttp();
    const [state, dispatch] = useReducer(scoreboardReducer, {
        intervalId: null,
        mode: null,
        task: null,
        result: []
    });

    const getScores = useCallback( async () => {
        try {
            if (isNaN(parseInt(state.task))) return;
            const msgFromSrv = await request('/api/model/get-score', 'POST', { task: (state.task+1) }, { Authorization: `Bearer ${auth.token}` });
            const result = msgFromSrv.result.sort((a, b) => {
                let aSum = a.scoresResult.reduce((sum, current) => sum + current.amount, 0);
                if ( state.mode === 'RES' ) aSum += a.hyhienicalScore ?? 0;
                let bSum = b.scoresResult.reduce((sum, current) => sum + current.amount, 0);
                if ( state.mode === 'RES' ) bSum += b.hyhienicalScore ?? 0;
                return bSum - aSum;
            });
            dispatch({ type: SCOREBOARD_SET_RESULT, result });
        }
        catch (e) {
            console.log(e);
        }
    }, [request, auth.token, state.task, state.mode]);

    const eventListenerCallback = useCallback( event => {
        if ( event.key === 'X' ) {
            dispatch({ type: SCOREBOARD_SET_TASK, task: null, mode: 'OFF' });
            auth.logout();
        }
        if ( event.code === 'Digit1' ) {
            const mode = event.shiftKey ? 'RES' : 'PRE';
            dispatch({ type: SCOREBOARD_SET_TASK, task: 0, mode });
        }
        if ( event.code === 'Digit2' ) {
            const mode = event.shiftKey ? 'RES' : 'PRE';
            dispatch({ type: SCOREBOARD_SET_TASK, task: 1, mode });
        }
        if ( event.code === 'Digit3' ) {
            const mode = event.shiftKey ? 'RES' : 'PRE';
            dispatch({ type: SCOREBOARD_SET_TASK, task: 2, mode });
        }
        if ( event.code === 'Digit4' ) {
            const mode = event.shiftKey ? 'RES' : 'PRE';
            dispatch({ type: SCOREBOARD_SET_TASK, task: 3, mode });
        }
        if ( event.code === 'Digit5' ) {
            const mode = event.shiftKey ? 'RES' : 'PRE';
            dispatch({ type: SCOREBOARD_SET_TASK, task: 4, mode });
        }
        if ( event.code === 'Digit0' ) {
            dispatch({ type: SCOREBOARD_SET_RESULT, result: [] });
            dispatch({ type: SCOREBOARD_SET_TASK, task: null, mode: 'OFF' });
        }
    }, [dispatch, auth]);

    useEffect(() => {
        if ( state.mode === 'OFF' ) {
            clearInterval(state.intervalId);
            dispatch({ type: SCOREBOARD_SET_INTERVAL, interval: null });
        }
        if ( state.mode === 'RES' ) {
            clearInterval(state.intervalId);
            getScores();
            dispatch({ type: SCOREBOARD_SET_INTERVAL, interval: null });
        }
        if ( state.mode === 'PRE' ) {
            clearInterval(state.intervalId);
            getScores();
            const interval = setInterval(getScores, 30000);
            dispatch({ type: SCOREBOARD_SET_INTERVAL, interval });
        }
    }, [state.mode, state.task]);

    return (
        <ScoreboardContext.Provider value={{
            scoreboardState: state, eventListenerCallback
        }}>
            {children}
        </ScoreboardContext.Provider>
    );
}