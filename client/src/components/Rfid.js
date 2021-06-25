import React, { useEffect } from 'react';
import rfidImg from '../img/rfid-img.png';

export const Rfid = ({ callBack, rfidCancelHandler, title }) => {    
    const rfidInputChange = event => {
        if ( isNaN(event.key) ) event.preventDefault();
        if ( event.key !== 'Enter' ) return;
        if ( event.target.value.length !== 10 ) {
            event.target.value = '';
            return;
        }
        const result = event.target.value;
        event.target.value = '';
        callBack(result);
    }

    useEffect(() => {
        document.querySelector('input[name="rfid"]').focus();
    }, []);
    
    return (
        <div className="container min-vh-100 d-flex flex-column justify-content-around align-items-center">
            { title && <p className="text-primary text-center fw-bold">{title}</p> }
            { rfidCancelHandler && <button
                className="btn btn-primary text-white text-uppercase btn-shadow mx-auto"
                onClick={rfidCancelHandler}
            >
                Отмена
            </button> }
            <img src={rfidImg} alt="rfid" width="200" />
            <p className="text-dark">Приложите метку участника</p>
            <input
                type="text"
                name="rfid"
                style={{ opacity: 0, height: 0, width: 0, margin: 0, padding: 0, border: 'none' }}
                onKeyDown={rfidInputChange}
                onBlur={event => event.target.focus()}
            />
        </div>
    )
}