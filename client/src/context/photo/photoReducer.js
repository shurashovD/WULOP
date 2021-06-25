import { PHOTO_AFTER_LOAD_END, PHOTO_AFTER_LOAD_START, PHOTO_BEFORE_LOAD_END, PHOTO_BEFORE_LOAD_START, PHOTO_INPUT, PHOTO_RESET, PHOTO_RFID } from "./types";

const handlers = {
    [PHOTO_RFID]: state => ({...state, step: 'Rfid'}),
    [PHOTO_INPUT]: (state, action) => ({...state, step: 'Input', model: action.model}),
    [PHOTO_BEFORE_LOAD_START]: state => ({...state, beforeImgLoading: true}),
    [PHOTO_BEFORE_LOAD_END]: state => ({...state, beforeImgLoading: false}),
    [PHOTO_AFTER_LOAD_START]: state => ({...state, afterImgLoading: true}),
    [PHOTO_AFTER_LOAD_END]: state => ({...state, afterImgLoading: false}),
    [PHOTO_RESET]: state => ({...state, step: 'Rfid', model: null}),
    DEFAULT: state => state
}

export const photoReducer = (state, action) => {
    const handler = handlers[action.type] || handlers['DEFAULT'];
    return handler(state, action);
}