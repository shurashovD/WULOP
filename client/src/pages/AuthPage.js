import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const toast = useToast();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        login: '', password: ''
    });

    useEffect(() => {
        toast(error);
        clearError();
    }, [error, clearError, toast]);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.type);
        }
        catch (e) {}
    }

    return(
        <div className="row">
            <div className="col s6 offset-s3 card blue-grey darken-1">
                <div className="card-content white-text">
                    <span className="card-title">Авторизация</span>
                    <div className="row">                                                 
                        <div className="input-field col s12">
                            <input
                                id="login"
                                type="text"
                                className="validate white-text"
                                name="login"
                                onChange={changeHandler}
                            />
                            <label htmlFor="login">Логин</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="password"
                                type="password"
                                className="validate white-text"
                                name="password"
                                onChange={changeHandler}
                            />
                            <label htmlFor="password">Пароль</label>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="waves-effect waves-light btn-small" onClick={loginHandler} disabled={loading}>Войти</button>
                    </div>
                </div>
            </div>
        </div>
    );
}