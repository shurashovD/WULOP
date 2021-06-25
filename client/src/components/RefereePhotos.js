import React from 'react';

export const RefereePhotos = ({ beforePhoto, afterPhoto, closeBtnCallback }) => {
    return (
        <div className="container-fluid fixed-top min-vh-100 bg-dark">
            <div className="row p-3">
                <button
                    className="btn-close btn-close-white ms-auto"
                    onClick={closeBtnCallback}
                />
            </div>
            <div className="row">
                <div className="col-6">
                    { beforePhoto && <img src={beforePhoto} className="img-fluid rounded" alt="before" /> }
                </div>
                <div className="col-6">
                    { afterPhoto && <img src={afterPhoto} className="img-fluid rounded" alt="after" /> }
                </div>
            </div>
        </div>
    );
}