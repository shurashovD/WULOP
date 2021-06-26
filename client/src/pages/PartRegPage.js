import React, { useCallback, useContext, useEffect, useState } from 'react';
import usersListLinkImg from '../img/users-list-link-img.png';
import { NavBar } from '../components/Navbar';
import { RegFirst } from '../components/RegFirst';
import { Rfid } from '../components/Rfid';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { ModalContext } from '../context/modal/modalContext';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';

export const PartRegPage = () => {
    const auth = useContext(AuthContext);
    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;
    const {show} = useContext(ModalContext);
    const {request, loading} = useHttp();

    const [step, setStep] = useState('RegFirst');

    const [form, setForm] = useState({
        team: '', task: null, taskDescription: '', rfid: null
    });

    const navLinks = [
        {to: 'registration/list', imgSrc: usersListLinkImg, imgAlt: 'add-user', title: dg('listOfParticipants')}
    ];

    const signIn = useCallback( async () => {
        try {
            const msgFromSrv = await request('/api/model/register', 'POST', form, { Authorization: `Bearer ${auth.token}` });
            if ( msgFromSrv.success ) {
                setForm({
                    team: '', task: null, taskDescription: '', rfid: null
                });
                show(msgFromSrv.number, 'register');
            }
        }
        catch (e) {
            show(e.message, 'error');
        }
    }, [request, auth.token, form, show]);

    const btnClkHandler = () => setStep('Rfid');

    const rfidCancelHandler = () => setStep('RegFirst');

    const rfidCallback = value => {
        setForm({...form, rfid: value});
        setStep('RegFirst');
    }

    useEffect(() => {
        if ( (form.team.length === 0) || (!form.task) || (form.rfid?.length !== 10) ) return;
        signIn();
    }, [form]);

    return(
        <div className="container">
            {step === 'RegFirst' && <NavBar links={navLinks} />}
            {step === 'RegFirst' && (<RegFirst
                form={form}
                setForm={setForm}
                btnClkHandler={btnClkHandler}
            />)}
            {step === 'Rfid' && <Rfid callBack={rfidCallback} rfidCancelHandler={rfidCancelHandler}/>}
            {loading && <Loader />}
        </div>
    );
}