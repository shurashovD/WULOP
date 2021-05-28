import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';

export const CreateProfilePage = () => {
    const auth = useContext(AuthContext);
    const toast = useToast();
    const {request, error, clearError} = useHttp();
    const [form, setForm] = useState({ login: '', password: '', device: 'RFID-REFEREE-1' });

    useEffect(() => {
        toast(error);
        clearError();
    }, [error, clearError, toast]);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    }

    const createProfileHandler = async () => {
        const data = request('/api/profiles/create', 'POST', form, { Authorization: `Bearer ${auth.token}` }); 
        console.log(data);
    }
    
    return(
        <form className="col s12 mt-2">
            <div className="row">
                <div className="input-field col s5">
                    <input id="login" type="text" className="validate" name="login" />
                    <label htmlFor="login" onChange={changeHandler}>Login</label>
                </div>
                <div className="input-field col s5 offset-s2">
                    <input id="password" type="text" className="validate" name="password" />
                    <label htmlFor="password" onChange={changeHandler}>Password</label>
                </div>
                <div className="input-field col s5">
                    <input id="descriptor" type="text" className="validate" name="descriptor" />
                    <label htmlFor="descriptor" onChange={changeHandler}>Descriptor</label>
                </div>
                <div className="input-field col s5 offset-s2">
                    <select className="browser-default" value={form.device} onChange={changeHandler} name="device">
                        <option value="" disabled selected>Device type</option>
                        <option value="RFID-REFEREE-1">Rfid-reader-referee-1</option>
                        <option value="RFID-REFEREE-2">Rfid-reader-referee-2</option>
                        <option value="RFID-REFEREE-3">Rfid-reader-referee-3</option>
                        <option value="RFID-REFEREE-4">Rfid-reader-referee-4</option>
                        <option value="RFID-REFEREE-5">Rfid-reader-referee-5</option>
                        <option value="RFID-REFEREE-6">Rfid-reader-referee-6</option>
                        <option value="RFID-REFEREE-7">Rfid-reader-referee-7</option>
                        <option value="RFID-REGISTER">Rfid-reader-register-station</option>
                        <option value="RFID-PHOTO">Rfid-reader-photo-station</option>
                        <option value="HYHIENIC">Hyhienical tablet</option>
                        <option value="REFEREE-1">Referee tablet 1</option>
                        <option value="REFEREE-2">Referee tablet 2</option>
                        <option value="REFEREE-3">Referee tablet 3</option>
                        <option value="REFEREE-4">Referee tablet 4</option>
                        <option value="REFEREE-5">Referee tablet 5</option>
                        <option value="REFEREE-6">Referee tablet 6</option>
                        <option value="REFEREE-7">Referee tablet 7</option>
                        <option value="SCOREBOARD">Scoreboard station</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <button className="waves-effect waves-light btn-small" onClick={createProfileHandler}>Create profile</button>
            </div>
        </form>
    );
}