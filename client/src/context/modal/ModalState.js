import React, { useCallback, useReducer } from 'react';
import { ModalContext } from './modalContext';
import { modalReducer } from './modalReducer';
import { HIDE_MODAL, SHOW_MODAL } from './types';

export const ModalState = ({children}) => {
    const [state, dispatch] = useReducer(modalReducer, {visible: false});

    const show = useCallback((text, type = 'success') => {
        dispatch({
            type: SHOW_MODAL,
            payload: { text, type }
        });
    }, [])

    const hide = () => dispatch({ type: HIDE_MODAL });

    return (
        <ModalContext.Provider value={{
            show, hide, modal: state
        }}>
            {children}
        </ModalContext.Provider>
    );
}