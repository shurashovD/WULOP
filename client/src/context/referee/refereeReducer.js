import { REFEREE_RESET_STATE, REFEREE_SET_INVALID, REFEREE_SET_LOAD, REFEREE_SET_MEDIA, REFEREE_SET_MIC_BUSY, REFEREE_SET_MODEL, REFEREE_SET_ONE_SRC, REFEREE_SET_PHOTO, REFEREE_SET_REC, REFEREE_SET_SCORES, REFEREE_SET_SRC, REFEREE_SET_UPDREC } from "./types";

const handlers = {
    [REFEREE_SET_MEDIA]: (state, action) => ({...state, audio: action.audio}),
    [REFEREE_SET_LOAD]: state => ({...state, loading: !state.loading}),
    [REFEREE_SET_MODEL]: (state, action) => ({...state, model: action.model}),
    [REFEREE_SET_SCORES]: (state, action) => ({...state, scores: action.scores, amount: action.amount}),
    [REFEREE_SET_MIC_BUSY]: (state, action) => ({...state, micBusy: action.value}), 
    [REFEREE_SET_REC]: (state, action) => ({...state, record: action.record}),
    [REFEREE_SET_UPDREC]: (state, action) => ({...state, updateRecord: action.updateRecord, updateKey: action.recordKey}),
    [REFEREE_SET_SRC]: (state, action) => ({...state, sources: action.sources}),
    [REFEREE_SET_ONE_SRC]: (state, action) => ({...state, sources: state.sources.set(state.micBusy, action.src)}),
    [REFEREE_SET_INVALID]: (state, action) => ({...state, invalid: action.value}),
    [REFEREE_SET_PHOTO]: (state, action) => ({...state, photo: action.value}),
    [REFEREE_RESET_STATE]: state => ({ ...state, model: null, scores: new Map(), amount: 0, sources: new Map(), invalid: false, photo: false }),
    DEFAULT: state => state
}

export const refereeReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
}