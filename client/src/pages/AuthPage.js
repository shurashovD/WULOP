import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import logoPlaceholder from '../img/login-bgi.svg';
import passPlaceholder from '../img/pass-bgi.svg';
import btnBgi from '../img/login-btn-bgi.svg';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';
import { Footer } from '../components/Footer';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const dictionary = useContext(DictionaryContext);
    const {dg, lang, setLang} = dictionary;
    const [loginInvalid, setLoginInvalid] = useState(false);
    const [passInvalid, setPassInvalid] = useState(false);
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        login: '', password: ''
    });

    const style = {
        login: {
            paddingLeft: '40px',
            backgroundImage: `url(${logoPlaceholder})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10px center'
        },
        password: {
            paddingLeft: '40px',
            backgroundImage: `url(${passPlaceholder})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10px center'
        },
        submit: {
            paddingLeft: '56px',
            backgroundImage: `url(${btnBgi})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '26px center'
        }
    };

    useEffect(() => {
        if ( error === 'loginError' ) setLoginInvalid(true);
        if ( error === 'passwordError' ) setPassInvalid(true);
    }, [error, clearError]);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
        setLoginInvalid(false);
        setPassInvalid(false);
        clearError();
    }

    const loginHandler = async () => {
        setLoginInvalid(false);
        setPassInvalid(false);
        clearError();
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.type, data.descriptor, data.id, lang);
        }
        catch (e) {}
    }

    return(
        <div className="min-vh-100 d-flex">
            <div className="container my-auto">
                <div className="row">
                    <form className="m-auto mb-4 border border-primary border-2 rounded px-4 py-5 shadow col-4 needs-validation">
                        <p className="text-center text-dark fw-bold">{dg('enterYourDetails')}</p>
                        <div className="input-group mb-3">
                            <input type="text"
                                className={"form-control shadow" + (loginInvalid && " is-invalid")}
                                placeholder={dg('login')}
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                style={ style.login }
                                value={form.login}
                                name="login"
                                onChange={event => changeHandler(event)}
                            />
                        </div>
                        <div className="input-group has-validation mb-4">
                            <input type="text"
                                className={"form-control shadow" + (passInvalid && " is-invalid")}
                                placeholder={dg('pass')}
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                style={ style.password }
                                value={form.password}
                                name="password"
                                onChange={event => changeHandler(event)}
                            />
                        </div>
                        <div className="input-group mt-5">
                            <button
                                className="btn btn-primary text-white btn-shadow mx-auto"
                                onClick={loginHandler}
                                disabled={loading}
                                style={ style.submit }
                            >
                                {dg('entrance')}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="row">
                    <div className="col-3 mx-auto">
                        <p className="text-primary text-center fw-bold">
                            {dg('selectLanguage')}
                        </p>
                        <div className="d-flex justify-content-center">
                            <p
                                className={"text-dark fw-bold border border-primary border-2 rounded p-2 me-2 " + (( lang === 'en' ) && "bg-secondary") }
                                onClick={() => setLang('en')}
                            >
                                EN
                            </p>
                            <p
                                className={"text-dark fw-bold border border-primary border-2 rounded p-2 me-2 " + (( lang === 'ru' ) && "bg-secondary") }
                                onClick={() => setLang('ru')}
                            >
                                RU
                            </p>
                            <p
                                className={"text-dark fw-bold border border-primary border-2 rounded p-2 me-2 " + (( lang === 'de' ) && "bg-secondary") }
                                onClick={() => setLang('de')}
                            >
                                DE
                            </p>
                            <p
                                className={"text-dark fw-bold border border-primary border-2 rounded p-2 me-2 " + (( lang === 'fr' ) && "bg-secondary") }
                                onClick={() => setLang('fr')}
                            >
                                FR
                            </p>
                            <p
                                className={"text-dark fw-bold border border-primary border-2 rounded p-2 " + (( lang === 'tr' ) && "bg-secondary") }
                                onClick={() => setLang('tr')}
                            >
                                TR
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}