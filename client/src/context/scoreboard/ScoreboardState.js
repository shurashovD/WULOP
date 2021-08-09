import React, { useContext, useEffect, useReducer } from 'react';
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

    const eventListenerCallback = event => {
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
    }

    useEffect(() => {
        async function getScores() {
            try {
                if (isNaN(parseInt(state.task))) return;
                const msgFromSrv = await request('/api/model/get-score', 'POST', { task: (state.task+1) }, { Authorization: `Bearer ${auth.token}` });
                const result = msgFromSrv.result.sort((a, b) => {
                    const aSum = a.scoresResult.reduce((sum, current) => sum + current.amount, ( state.mode === 'RES' ) ? a.hyhienical ?? 0 : 0);
                    const bSum = b.scoresResult.reduce((sum, current) => sum + current.amount, ( state.mode === 'RES' ) ? b.hyhienical ?? 0 : 0);
                    return bSum - aSum;
                });
                dispatch({ type: SCOREBOARD_SET_RESULT, result });
            }
            catch (e) {
                console.log(e);
            }
        }
        if ( state.mode === 'PRE' ) {
            const interval = setInterval(getScores, 5000);
            dispatch({ type: SCOREBOARD_SET_INTERVAL, interval });
            getScores();
        }
        if ( state.mode === 'RES' ) {
            getScores();
            dispatch({ type: SCOREBOARD_SET_INTERVAL, interval: null });
        }
        if ( state.mode === 'OFF' ) {
            dispatch({ type: SCOREBOARD_SET_INTERVAL, interval: null });
        }
    }, [state.mode, state.task, request, auth.token]);

    return (
        <ScoreboardContext.Provider value={{
            scoreboardState: state, eventListenerCallback
        }}>
            {children}
        </ScoreboardContext.Provider>
    );
}