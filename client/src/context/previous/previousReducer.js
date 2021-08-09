import { PREV_REFEREE_SET_AUDIO, PREV_REFEREE_SET_COMMENT_SRC, PREV_REFEREE_SET_INVALID, PREV_REFEREE_SET_LOADING, PREV_REFEREE_SET_MIC_BUSY, PREV_REFEREE_SET_MODEL, PREV_REFEREE_SET_REC, PREV_REFEREE_SET_SCORE } from "./types"

const setScore = (state, action) => {
    const prevScore = []
    for ( let [testId, value] of action.payload ) {
        prevScore.push({testId, value})
    }
    if ( Boolean(state.model) )
    return {...state, scores: action.payload, model: {...state.model, prevScore}}
    return {...state, scores: action.payload}
}

const handlers = {
    [PREV_REFEREE_SET_LOADING]: state => ({...state, loading: !state.loading}),
    [PREV_REFEREE_SET_MODEL]: (state, action) => ({...state, model: action.model}),
    [PREV_REFEREE_SET_SCORE]: setScore,
    [PREV_REFEREE_SET_AUDIO]: (state, action) => ({...state, audio: action.payload}),
    [PREV_REFEREE_SET_MIC_BUSY]: (state, action) => ({...state, micBusy: action.payload}),
    [PREV_REFEREE_SET_REC]: (state, action) => ({...state, record: action.payload}),
    [PREV_REFEREE_SET_COMMENT_SRC]: (state, action) => ({...state, model: {...state.model, prevComment: action.payload}}),
    [PREV_REFEREE_SET_INVALID]: (state, action) => ({...state, invalid: action.payload}),
    DEFAULT: state => state
}

export const previousReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT
    return handler(state, action)
}