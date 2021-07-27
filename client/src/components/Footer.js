import React, { useContext } from 'react';
import Sabina from '../img/Sabina.png'
import Logo from '../img/footer-logo.png'
import Inst from '../img/footer-inst.svg'
import { DictionaryContext } from '../context/dictionary/dictionaryContext';

export const Footer = () => {
    const dictionary = useContext(DictionaryContext);
    const { dg } = dictionary;

    const style = {
        background: 'radial-gradient(circle 320px at bottom,  #56E0D1, rgba(0, 0, 0, 0))',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        width: '600px',
        height: '350px',
        marginLeft: 'auto',
        position: 'fixed',
        bottom: 0,
        right: 0
    }

    return(
        <div style={style} className="d-flex justify-content-center align-items-end">
            <img src={Sabina} height="160" alt="Sabina" />
            <div className="d-flex flex-column">
                <small>{ dg('logoTitle') }</small>
                <img src={Logo} alt="logo" />
            </div>
            <a href="https://www.instagram.com/sabina.knaub/" className="ms-2 mb-4"><img src={Inst} alt="Instagram" /></a>
        </div>
    );
} 