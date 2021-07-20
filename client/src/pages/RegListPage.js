import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { NavBar } from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { ModalContext } from '../context/modal/modalContext';
import { TasksContext } from '../context/tasks/TasksContext';
import { useHttp } from '../hooks/http.hook';
import userAddLinkImg from '../img/add-user.svg';

export const RegListPage = () => {
    const {tasks} = useContext(TasksContext);
    const auth = useContext(AuthContext);
    const {show} = useContext(ModalContext);
    const [models, setModels] = useState([]);
    const {loading, request} = useHttp();
    const [error, setError] = useState(null);

    const navLinks = [
        {to: 'registration/', imgSrc: userAddLinkImg, imgAlt: 'add-user', title: 'Добавить участника'}
    ];

    const getModels = useCallback( async () => {
        try {
            const msgFromSrv = await request('/api/model/get-models', 'POST', null, { Authorization: `Bearer ${auth.token}` });
            setModels(msgFromSrv.models);
        }
        catch (e) {
            setError(e.message);
        }
    }, [request, auth.token]);

    useEffect(() => {
        getModels();
    }, [getModels]);

    useEffect(() => {
        if ( error ) {
            show(error, 'error');
            setError(null);
        }
    });

    return (
        <div className="container">
            <NavBar links={navLinks} />
            { loading && <Loader /> }
            { models.length === 0 && <p className="text-dark fw-bold text-center mt-5">Нет зарегистрированных участников</p> }
            { models.length !== 0 && <p className="text-dark fw-bold text-center mt-5">Зарегистрированные участники</p> }
            { models.length !== 0 && (
                <div className="row bg-primary p-2 rounded">
                    <p className="col-3 p-0 m-0 text-white fw-bold text-center">Номер участника</p>
                    <p className="col-3 p-0 m-0 text-white fw-bold text-center">Фамилия, имя</p>
                    <p className="col-3 p-0 m-0 text-white fw-bold text-center">E-mail</p>
                    <p className="col-3 p-0 m-0 text-white fw-bold text-center">Категория</p>
                </div>
            )}
            {
                models.map(item => 
                    (
                        <div className="row border border-primary mt-1 p-0 rounded d-flex" key={item.number}>
                            <div className="col-3 d-flex">
                                <p className="p-2 m-auto text-primary fw-bold text-center">{item.number}</p>
                            </div>
                            <div className="border-start border-end border-primary col-3 d-flex">
                                <p className="p-2 m-auto text-primary fw-bold text-center">{item.team}</p>
                            </div>
                            <div className="border-start border-end border-primary col-3 d-flex">
                                <p className="p-2 m-auto text-primary fw-bold text-center">{item.mail}</p>
                            </div>
                            <div className="col-3 d-flex">
                                <p className="p-2 m-auto text-primary fw-bold text-center">{tasks[item.task-1]?.name}</p>
                            </div>
                        </div>
                    )
                )
            }
        </div>
    )
}