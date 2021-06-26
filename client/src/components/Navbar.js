import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import headerLogoutImg from '../img/header-logout-img.png';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';

export const NavBar = ({links}) => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;

    if ( !links ) links = [];
    
    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        history.push('/');
    }
    
    return(
        <div className="row py-2 justify-content-end">
            {links.map((link, index) => {
                const {to, imgSrc, imgAlt, title} = link;
                return (
                    <div className="col-3" key={index}>
                        <NavLink to={to}>
                            <img src={imgSrc} alt={imgAlt} className="me-2"/>
                            <span className="text-dark">{title}</span>
                        </NavLink>
                    </div>
                )
            }) }
            <div className="col-2">
                <a href="/" onClick={logoutHandler}>
                    <img src={headerLogoutImg} alt="exit" className="me-2"/>
                    <span className="text-dark">{dg('goOut')}</span>
                </a>
            </div>
        </div>
    );
}