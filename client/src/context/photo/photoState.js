import { useContext, useReducer } from "react";
import { PhotoContext } from "./photoContext";
import { photoReducer } from "./photoReducer";
import { PHOTO_AFTER_LOAD_END, PHOTO_AFTER_LOAD_START, PHOTO_BEFORE_LOAD_END, PHOTO_BEFORE_LOAD_START, PHOTO_INPUT, PHOTO_RESET } from "./types";
import { AuthContext } from "../AuthContext";
import { useHttp } from "../../hooks/http.hook";

export const PhotoState = ({children}) => {
    const { uplaodFile } = useHttp();
    const auth = useContext(AuthContext);
    const [state, dispatch] = useReducer(photoReducer, {
        step: 'Rfid',
        model: null,
        beforeImgLoading: false,
        afterImgLoading: false,
        beforeImg: null,
        afterImg: null
    });

    const setModel = model => dispatch({ type: PHOTO_INPUT, model });

    const fileInputCallBack = async ({id, file, photoKey}) => {
        dispatch({ type: (photoKey === 'beforePhoto') ? PHOTO_BEFORE_LOAD_START : PHOTO_AFTER_LOAD_START });
        
        const formData = new FormData();
        if ( file ) formData.append('file', file);
        formData.append('id', id);
        formData.append('photoKey', photoKey);
        try {
            const msgFromSrv = await uplaodFile('/api/model/insert-photo', formData, { Authorization: `Bearer ${auth.token}` });
            const model = msgFromSrv.model;
            if ( model.beforePhoto === '' ) model.beforePhoto = null;
            if ( model.afterPhoto === '' ) model.afterPhoto = null;
            setModel(model);

            dispatch({ type: (photoKey === 'beforePhoto') ? PHOTO_BEFORE_LOAD_END : PHOTO_AFTER_LOAD_END });
        }
        catch (e) {
            console.log(e);
            dispatch({ type: (photoKey === 'beforePhoto') ? PHOTO_BEFORE_LOAD_END : PHOTO_AFTER_LOAD_END });
        }
    }

    const reset = () => dispatch({ type: PHOTO_RESET });

    return (
        <PhotoContext.Provider value={{ photo: state, setModel, fileInputCallBack, reset }}>
            {children}
        </PhotoContext.Provider>
    );
}