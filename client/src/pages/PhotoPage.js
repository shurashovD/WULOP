import React, { useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ModalContext } from '../context/modal/modalContext';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader';
import { NavBar } from '../components/Navbar';
import { PhotoInputs } from '../components/PhotoInputs';
import { Rfid } from '../components/Rfid';
import { PhotoContext } from '../context/photo/photoContext';

export const PhotoPage = () => {
    const auth = useContext(AuthContext);
    const {photo, setModel} = useContext(PhotoContext);
    const {show} = useContext(ModalContext);
    const {loading, request} = useHttp();

    const rfidCallback = useCallback(async rfid => {
        try {
            const msgFromSrv = await request('/api/model/get-model', 'POST', { rfid }, { Authorization: `Bearer ${auth.token}` });
            const model = JSON.parse(msgFromSrv.model);
            if ( model.beforePhoto === '' ) model.beforePhoto = null;
            if ( model.afterPhoto === '' ) model.afterPhoto = null;
            setModel(model);
        }
        catch (e) {
            show(e.message, 'error');
        }
    }, [request, auth.token, show, setModel]);

    return(
        <div className="container">
            <NavBar />
            { loading && <Loader /> }
            { photo.step === 'Rfid' && <Rfid callBack={rfidCallback}/> }
            { photo.step === 'Input' && <PhotoInputs /> }
        </div>  
    );
}