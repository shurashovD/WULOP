import React, { useContext, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';

export const PartRegPage = () => {
    const auth = useContext(AuthContext);
    const toast = useToast();
    const {request} = useHttp();
    const [ready, setReady] = useState(false);
    const [rfidBtnText, setRfidBtnText] = useState('Метка отсутствует');
    const [submitBtnText, setSubmitBtnText] = useState('Зарегистрировать');

    const [form, setForm] = useState({
        team: '',
        task: 1,
        rfid: null
    });

    const getStatus = useCallback (async () => {
        try {
            const msgFromSrv = await request('/api/device/status', 'GET', null, { Authorization: `Bearer ${auth.token}` });
            if (msgFromSrv?.status !== 'SUCCESS') {
                setTimeout(getStatus, 2000);
                return;
            }
            setForm( {
                team: form.team,
                task: form.task,
                rfid: msgFromSrv.value
            } );
            setRfidBtnText('Метка получена');
            setReady(true);
        }
        catch (e) {}
    }, [request, auth.token, setReady, form]);

    const readInit = useCallback (async () => {
        try {
            await request('/api/device/master-init-read', 'POST', null, { Authorization: `Bearer ${auth.token}` });
            getStatus();
        }
        catch (e) {}
    }, [request, auth.token, getStatus]);

    const rfidBtnHandler = () => {
        setRfidBtnText('Читаю метку . . .');
        readInit();
    }

    const changeHandler = event => {
        setReady(false);
        setForm({...form, [event.target.name]: event.target.value});
        if ( form.rfid?.length === 10 ) setReady(true);
        if ( form.team.length === 0 ) setReady(false);
    }

    const submitHandler = useCallback( async () => {
        setReady(false);
        setSubmitBtnText('Ждите . . .');
        try {
            const msgFromSrv = await request('/api/model/register', 'POST', form, { Authorization: `Bearer ${auth.token}` });
            toast( msgFromSrv?.message ?? 'Непонятный ответ от сервера' );
            if ( msgFromSrv.success ) {
                setForm({
                    team: '',
                    task: 1,
                    rfid: null
                });
                setReady(false);
                setRfidBtnText('Метка отсутствует');
                setSubmitBtnText('Зарегистрировать');
            }
        }
        catch (e) {
            toast( e );
            setSubmitBtnText('Зарегистрировать');
            setReady(true);
        }
    }, [setReady, request, toast, auth.token, form]);

    return(
        <div className="row" style={{ minHeight: '50vh' }}>
            <form className="col s12" onSubmit={ event => event.preventDefault() }>
                <div className="row">
                    <div className="input-field col s6">
                        <input id="first_name" type="text" className="validate" name="team" value={form.team} onChange={changeHandler} />
                        <label htmlFor="first_name">Имя участника</label>
                    </div>
                    <div className="input-field col s6">
                        <div>
                            <select className="browser-default" value={form.task} onChange={changeHandler} name="task">
                                <option value="0" disabled>Конкурсное задание</option>
                                <option value="1">Эффект губной помады</option>
                                <option value="2">Стрелка с прокрасом межресничного пространства и Растушевкой</option>
                                <option value="3">Растушевка</option>
                                <option value="4">Микроблейдинг</option>
                                <option value="5">Bолосковая техника</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <button className="waves-effect waves-light btn-large col s3 orange accent-3 offset-s1" onClick={rfidBtnHandler}>{rfidBtnText}</button>
                    <button className="waves-effect waves-light btn-large col s3 offset-s4" disabled={!ready} onClick={submitHandler}>{submitBtnText}</button>
                </div>
            </form>
        </div>
    );
}