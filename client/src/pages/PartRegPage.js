import React, { useContext, useEffect, useState } from 'react';
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
    const [error, setError] = useState(null);
    const [regNumber, setRegNumber] = useState(null);

    const [form, setForm] = useState({
        team: '', mail: '', task: null, taskDescription: '', rfid: null
    });

    const navLinks = [
        {to: 'registration/list', imgSrc: usersListLinkImg, imgAlt: 'add-user', title: dg('listOfParticipants')}
    ];

    const btnClkHandler = () => setStep('Rfid');

    const rfidCancelHandler = () => setStep('RegFirst');

    const rfidCallback = value => {
        setForm({...form, rfid: value});
        setStep('RegFirst');
    }

    useEffect(() => {
        async function signIn() {
            try {
                const msgFromSrv = await request('/api/model/register', 'POST', form, { Authorization: `Bearer ${auth.token}` });
                if ( msgFromSrv.success ) {
                    setForm({
                        team: '', mail: '', task: null, taskDescription: '', rfid: null
                    });
                    setRegNumber(msgFromSrv.number);
                }
            }
            catch (e) {
                setForm({...form, rfid: null});
                setError(e.message);
            }
        }

        if ( Boolean(form.team) && form.task && (form.rfid?.length === 10) ) signIn();
    }, [form, request, auth.token]);

    useEffect(() => {
        if ( error ) {
            show(error, 'error');
            setError(null);
        }
    }, [error, show]);

    useEffect(() => {
        if ( regNumber ) {
            show(regNumber, 'register');
            setRegNumber(null);
        }
    }, [regNumber, show]);

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