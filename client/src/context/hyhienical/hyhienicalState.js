import { useCallback, useContext, useReducer } from "react";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../AuthContext";
import { DictionaryContext } from "../dictionary/dictionaryContext";
import { ModalContext } from "../modal/modalContext";
import { HyhienicalContext } from "./hyhienicalContext";
import { hyhienicalReducer } from "./hyhienicalReducer";
import { HYHIENIC_REC, HYHIENIC_RESET_STATE, HYHIENIC_SET_LOADING, HYHIENIC_SET_MODEL, HYHIENIC_SET_MODEL_LOADING, HYHIENIC_SET_NUMBER, HYHIENIC_SET_REC, HYHIENIC_SET_SCORE, HYHIENIC_SET_UPDREC } from "./types";

export const HyhienicalState = ({children}) => {
    const auth = useContext(AuthContext);
    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;
    const { request, uplaodFile } = useHttp();
    const { show } = useContext(ModalContext);
    const [state, dispatch] = useReducer(hyhienicalReducer, {
        model: null,
        number: '',
        modelLoading: false,
        audio: null,
        file: null,
        record: false,
        updateRecord: false,
        loading: false
    });

    const setMedia = useCallback( audio => dispatch({ type: HYHIENIC_SET_REC, audio }), []);

    const setModel = useCallback(model => dispatch({ type: HYHIENIC_SET_MODEL, model }), []);

    const sendComment = useCallback( async event => {
        dispatch({ type: HYHIENIC_SET_UPDREC, value: true });
        const file = new File([event.data], `${state.model._id}_${performance.now()}__h.webm`);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', state.model._id);
        try {
            const modelString = await uplaodFile('/api/model/hyhienical-comment', formData, { Authorization: `Bearer ${auth.token}` });
            dispatch({ type: HYHIENIC_SET_UPDREC, value: false });
            const model = JSON.parse(modelString.model);
            model.hyhienicalScore = state.model.hyhienicalScore
            setModel(model);
        }
        catch (e) {
            dispatch({ type: HYHIENIC_SET_UPDREC, value: false });
            console.log(e);
        }
    }, [state.model, uplaodFile, auth.token, setModel]);

    const initAudio = useCallback( async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audio = new MediaRecorder(stream);
        audio.addEventListener('dataavailable', sendComment);
        setMedia(audio);
    }, [setMedia, sendComment]);

    const setRecord = () => dispatch({ type: HYHIENIC_REC });

    const getModel = useCallback( async number => {
        dispatch({ type: HYHIENIC_SET_MODEL_LOADING, value: true });
        try {
            const msgFromSrv = await request('/api/model/get-model-by-number', 'POST', { number }, { Authorization: `Bearer ${auth.token}` });
            const model = JSON.parse(msgFromSrv.model);
            setModel(model);

            dispatch({ type: HYHIENIC_SET_MODEL_LOADING, value: false });
        }
        catch (e) {
            setModel();
            dispatch({ type: HYHIENIC_SET_MODEL_LOADING, value: false });
        }
    }, [request, setModel, auth.token]);

    const setNumber = event => {
        const number = event.target.value;
        dispatch({ type: HYHIENIC_SET_NUMBER, number });
        if ( number === '' ) {
            setModel();
            return;
        }
        getModel(number);
    }

    const setHyhienicalScore = event => dispatch({ type: HYHIENIC_SET_SCORE, score: event.target.value });
    
    const readyHandler = useCallback( async () => {
        dispatch({ type: HYHIENIC_SET_LOADING });
        try {
            const msgFromSrv = await request('/api/model/set-hyhienic', 'POST', {
                modelId: state.model._id, score: state.model.hyhienicalScore
            }, { Authorization: `Bearer ${auth.token}` });
            dispatch({ type: HYHIENIC_SET_LOADING });
            if ( msgFromSrv.success ) {
                show(dg('pointsAreCounted'));
                setModel(null);
                dispatch({ type: HYHIENIC_SET_NUMBER, number: '' });
                return;
            }
            show('Ошибка сохранения оценки', 'error');
        }
        catch (e) {
            show(e.message, 'error');
            console.log(e);
            dispatch({ type: HYHIENIC_SET_LOADING });
        }
    }, [state.model, request, auth.token, show, setModel, dg]);

    const resetState = useCallback(() => {
        dispatch({ type: HYHIENIC_RESET_STATE })
    }, [])

    return (
        <HyhienicalContext.Provider value={{
            hyhienicState: state,
            initAudio, setNumber, setRecord, setHyhienicalScore, readyHandler, resetState
        }}>
            {children}
        </HyhienicalContext.Provider>
    );
}