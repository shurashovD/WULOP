import React, {useContext} from 'react';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';
import { PhotoContext } from '../context/photo/photoContext';
import { TasksContext } from '../context/tasks/TasksContext';
import noneImg from '../img/none.svg';

export const PhotoInputs = () => {
    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;
    const { photo, fileInputCallBack, reset } = useContext(PhotoContext);
    const { number, task, beforePhoto, afterPhoto } = photo.model;
    const { beforeImgLoading, afterImgLoading } = photo;
    const { tasks } = useContext(TasksContext);

    const fileInputHandler = event => {
        if ( !event.target.files[0] ) return;
        fileInputCallBack({
            id: photo.model._id, file: event.target.files[0], photoKey: event.target.name
        });
    }

    const delPhotoHandler = event => {
        fileInputCallBack({
            id: photo.model._id, photoKey: event.target.name
        });
    }

    return (
        <div className="container-fluid min-vh-75 d-flex flex-column">
            <p className="text-primary text-center fw-bold mt-3">{dg('photographer')}</p>
            <p className="text-primary text-center fw-bold fs-3">
                 {dg('participant')}: №{number}. {dg('category')}: “{tasks[task-1].name}”
            </p>
            <div className="row">
                <div className="col-1"></div>
                <label className="btn btn-primary btn-shadow text-white text-uppercase col-4">
                    {dg('uploadPhotoBefore')}
                    <input type="file" name="beforePhoto" className="d-none" accept="image/jpeg" onInput={fileInputHandler} />
                </label>
                <div className="col-2"></div>
                <label className="btn btn-primary btn-shadow text-white text-uppercase col-4">
                    {dg('uploadPhotoAfter')}
                    <input type="file" name="afterPhoto" className="d-none" accept="image/jpeg" onInput={fileInputHandler} />
                </label>
            </div>
            <div className="row my-4">
                <div className="col-1"></div>
                <div className={"col-4 border border-primary rounded px-0 " + (!beforePhoto && "py-5 d-flex justify-content-center")}>
                    {
                        !beforeImgLoading &&
                        <img
                            src={beforePhoto ?? noneImg}
                            className={"img-thumbnail rounded " + (beforePhoto ? "col-12" : "opacity col-5")}
                            alt="before"
                        />
                    }
                    { beforeImgLoading && <div className="spinner-border text-primary m-auto" /> }
                </div>
                <div className="col-2"></div>
                <div className={"col-4 border border-primary rounded px-0 " + (!afterPhoto && "py-5 d-flex justify-content-center")}>
                    {
                        !afterImgLoading &&
                        <img
                            src={afterPhoto ?? noneImg}
                            className={"img-thumbnail rounded " + (afterPhoto ? "col-12" : "opacity col-5")}
                            alt="after"
                        />
                    }
                    { afterImgLoading && <div className="spinner-border text-primary m-auto" /> }
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-1"></div>
                <button name="beforePhoto" className="btn btn-primary btn-shadow text-white text-uppercase col-4" onClick={delPhotoHandler}>
                    {dg('delete')}
                </button>
                <div className="col-2"></div>
                <button name="afterPhoto" className="btn btn-primary btn-shadow text-white text-uppercase col-4" onClick={delPhotoHandler}>
                    {dg('delete')}
                </button>
            </div>
            <div className="row">
                <button
                    className="btn btn-primary btn-shadow col-4 mx-auto text-white text-uppercase"
                    onClick={reset}
                >
                    {dg('done')}
                </button>
            </div>
        </div>
    );
}