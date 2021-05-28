import React from 'react';

export const RfidWait = () => {
    return(
        <div>
            <div className="row mt-5">
                <h5 className="col s12 blue-text text-darken-1 center">Читаю метку</h5>
            </div>
            <div className="row mt-3">
                <div className="col s12 center">
                    <div className="preloader-wrapper big active">
                        <div className="spinner-layer spinner-blue-only">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}