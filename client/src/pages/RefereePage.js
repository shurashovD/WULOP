import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { NavBar } from '../components/Navbar';
import { RefereeMain } from '../components/ReereeMain';
import { RefereePhotos } from '../components/RefereePhotos'
import { Rfid } from '../components/Rfid'
import { RefereeContext } from '../context/referee/RefereeContext';

export const RefereePage = () => {
    const auth = useContext(AuthContext);
    const { refereeState, rfidCallback, photoCloseHandler } = useContext(RefereeContext);
    const { loading, model, photo } = refereeState;

    return(
        <div className="container d-flex flex-column">
            { photo && <RefereePhotos beforePhoto={model.beforePhoto} afterPhoto={model.afterPhoto} closeBtnCallback={photoCloseHandler} /> }
            <NavBar />
            { loading && <Loader /> }
            { !model && <Rfid callBack={rfidCallback} title={auth.description} /> }
            { model && <RefereeMain /> }
        </div>
    );
}