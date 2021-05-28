import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export const NavBar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    
    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        history.push('/');
    }
    
    return(
        <a href="/" onClick={logoutHandler} style={{ marginLeft: 'auto', marginRight: '2rem' }}>Logout</a>
    );
}