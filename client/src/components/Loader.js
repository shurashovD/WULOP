import React from 'react';

export const Loader = () => {
    return (
        <div
            className="position-fixed top-0 start-0 container-fluid min-vh-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
            <div
                className="spinner-border text-primary"
                style={{width: '3rem',  height: '3rem'}}
            />
        </div>
    );
}