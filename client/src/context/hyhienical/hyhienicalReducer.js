import { HYHIENIC_REC, HYHIENIC_RESET_STATE, HYHIENIC_SET_LOADING, HYHIENIC_SET_MODEL, HYHIENIC_SET_MODEL_LOADING, HYHIENIC_SET_NUMBER, HYHIENIC_SET_REC, HYHIENIC_SET_SCORE, HYHIENIC_SET_UPDREC } from "./types";

const hyhienicSetScore = (state, action) => {
    const newHyhienicalScore = state.model.hyhienicalScore.map(score => {
        if (score.testId === action.testId) return {testId: action.testId, value: action.score}
        return score
    })
    if ( !Boolean(newHyhienicalScore.find(item => item.testId === action.testId)) ) {
        newHyhienicalScore.push({testId: action.testId, value: action.score})
    }
    return {...state, model: {...state.model, hyhienicalScore: newHyhienicalScore}}
}

const handlers = {
    [HYHIENIC_SET_NUMBER]: (state, action) => ({...state, number: action.number}),
    [HYHIENIC_SET_MODEL_LOADING]: (state, action) => ({...state, modelLoading: action.value}),
    [HYHIENIC_SET_MODEL]: (state, action) => ({...state, model: action.model}),
    [HYHIENIC_SET_SCORE]: hyhienicSetScore,
    [HYHIENIC_SET_REC]: (state, action) => ({...state, audio: action.audio}),
    [HYHIENIC_REC]: state => ({...state, record: !state.record}),
    [HYHIENIC_SET_UPDREC]: (state, action) => ({...state, updateRecord: action.value}),
    [HYHIENIC_SET_LOADING]: state => ({...state, loading: !state.loading}),
    [HYHIENIC_RESET_STATE]: () => ({ model: null, number: '', modelLoading: false, audio: null, file: null, record: false, updateRecord: false, loading: false }),
    DEFAULT: state => state 
}

export const hyhienicalReducer = (state, action) => {
    const handler = handlers[action.type] || handlers.DEFAULT;
    return handler(state, action);
}