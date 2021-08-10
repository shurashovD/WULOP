import React from 'react';

export const RefereePhotos = ({ beforePhoto, afterPhoto, closeBtnCallback }) => {
    return (
        <div className="container-fluid min-vh-100 bg-dark" style={{position: 'absolute', left: '0', top: '0', zIndex: '1000'}}>
            <div className="row p-3">
                <button
                    className="btn-close btn-close-white ms-auto"
                    onClick={closeBtnCallback}
                />
            </div>
                <div className="container-fluid">
                    { beforePhoto && <img src={beforePhoto} alt="before"
                        style={{maxWidth: '100%', width: '100%'}}
                    /> }
                </div>
                <div className="container-fluid">
                    { afterPhoto && <img src={afterPhoto} alt="after"
                        style={{maxWidth: '100%', width: '100%'}}
                    /> }
                </div>
        </div>
    );
}