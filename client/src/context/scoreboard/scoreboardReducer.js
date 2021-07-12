import { SCOREBOARD_SET_INTERVAL, SCOREBOARD_SET_RESULT, SCOREBOARD_SET_TASK } from "./types";

const handlers = {
    [SCOREBOARD_SET_TASK]: (state, action) => ({...state, task: action.task, mode: action.mode}),
    [SCOREBOARD_SET_INTERVAL]: (state, action) => {
        if ( state.intervalId !== null ) {
            clearTimeout(state.intervalId);
        }
        return {...state, intervalId: action.interval};
    },
    [SCOREBOARD_SET_RESULT]: (state, action) => ({...state, result: action.result}),
    DEFAULT: state => state
}

export const scoreboardReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
}