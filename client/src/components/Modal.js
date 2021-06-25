import React, { useContext } from 'react';
import { ModalContext } from '../context/modal/modalContext';
import errorImg from '../img/error-img.png';

export const Modal = () => {
    const {modal, hide} = useContext(ModalContext);
    const {text, type} = modal;

    if ( !modal.visible ) return null;

    return (
        <div
            className="container-fluid min-vh-100 position-fixed d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
            <div className="container">
            <div className="row">
            <div className="col-5 mx-auto p-5 rounded bg-secondary btn-shadow">
                { type === 'register' && <p className="text-white text-uppercase text-center mb-1">
                    Регистрация участника прошла успешно!
                </p> }
                { type === 'register' && <p className="text-white text-uppercase text-center">
                    Номер участника
                </p> }
                <p className={"text-white text-uppercase text-center " + ( (type === 'register') && "fs-1")}>
                    {text}
                </p>
                { type === 'error' && <div className="row mb-4">
                    <img src={errorImg} className="col-3 mx-auto" alt="error" />
                </div> }
                <div className="row">
                    <button
                        className="col-3 btn btn-secondary text-white fw-bold rounded mx-auto"
                        style={{boxShadow: '5px 5px 5px #40A69B, -5px -5px 5px #56E0D1'}}
                        onClick={hide}
                    >
                        OK
                    </button>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}