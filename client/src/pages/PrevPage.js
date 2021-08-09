import React, { useContext } from 'react'
import { Loader } from '../components/Loader';
import { NavBar } from '../components/Navbar';
import { PreviousMain } from '../components/PreviousMain';
import { Rfid } from '../components/Rfid';
import { AuthContext } from '../context/AuthContext';
import { PreviousContext } from '../context/previous/PreviousContext';

export const PrevPage = () => {
    const auth = useContext(AuthContext)
    const { prevRefereeState, rfidCallback } = useContext(PreviousContext)
    const { loading, model } = prevRefereeState

    return(
        <div className="container d-flex flex-column">
            <NavBar />
            { loading && <Loader /> }
            { !model && <Rfid callBack={rfidCallback} title={auth.description} /> }
            { model && <PreviousMain /> }
        </div>
    );
}