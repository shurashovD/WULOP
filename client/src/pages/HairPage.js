import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHistory } from 'react-router';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';

const Obj = {
        task: 5,
        name: 'Bолосковая техника',
        list: [
            {
                test: 'Гармоничность образа',
                dect: 'Оценивается общий вид модели: опрятность, чистота, ухоженность. Гармоничность подбора формы и цвета в комплексе для данной модели. Также оценивается на сколько конкурсант подчеркнул индивидуальность. Cyмел ли участник добиться индивидуальности',
                value: 0
            },
            {
                test: 'Форма',
                dect: 'Оценивается насколько участник корректно и естественно подобрал форму для модели.',
                value: 0
            },
            {
                test: 'Естественность укладки волосков',
                dect: 'Оценивается соответствиe нанесенного рисунка приданой форме укладки брови модели.',
                value: 0
            },
            {
                test: 'Четкость и изящность волоска',
                dect: 'Оценивается равномерность и насыщенность цвета, прокраса волоска, изгиб, утонченность с двух сторон и толщина.',
                value: 0
            },
            {
                test: 'Правильное расстояние волосков друг от друга',
                dect: 'Оценивается допустимoе расстояниe между волосками.',
                value: 0
            },
            {
                test: 'Цвет',
                dect: 'Оценивается гармоничность подбора цвета брови исходя из цветотипа модели, ее цвета кожи, волос и глаз.',
                value: 0
            },
            {
                test: 'Симметрия',
                dect: 'Оценивается насколько участник смог выровнять природную асимметрию исходя из анатомических исходных данных, а также симметричность деталей губ относительно друг к другу. И симметричность укладки волоска на двух бровях.',
                value: 0
            },
            {
                test: 'Травматизация',
                dect: 'Оценивается наличие засаженных линий, отека, нахлёст одного волоска на другой , явное покраснение. Чем меньше этих признаков тем выше балл.',
                value: 0
            },
            {
                test: 'Сложность работы',
                dect: 'Оценивается также кожа модели и первоначальное наличие своих природных волосков.',
                value: 0
            },
            {
                test: 'Укладка волосков',
                dect: 'Оценивается сложность рисунка укладки волосков. Гармоничность подбора укладки волосков под уже имеющиеся волоски на бровях модели. Выделение темных и светлых зон бровей.',
                value: 0
            }
        ]
    }

export const HairPage = () => {
    const auth = useContext(AuthContext);
    const toast = useToast();
    const history = useHistory();
    const [scores, setScores] = useState(Obj.list);
    const [finnaly, setFinnaly] = useState(0);
    const [modelId, setModelId] = useState(null);
    const {loading, request} = useHttp();

    const getStatus = useCallback (async () => {
        try {
            const msgFromSrv = await request('/api/device/status', 'GET', null, { Authorization: `Bearer ${auth.token}` });
            const rfid = msgFromSrv.value;
            const data = await request('/api/model/get-model', 'POST', { rfid }, { Authorization: `Bearer ${auth.token}` });
            if ( data?.model ) {
                const model = JSON.parse(data.model);
                setModelId(model._id);
                return;
            }
            throw new Error('Ошибка получения участника');
        }
        catch (e) {
            toast(e);
            history.push('/');
        }
    }, [request, auth.token, toast, history]);

    const changeHandler = event => {
        const key = event.target.getAttribute('data-key');
        const newState = scores.map((item, index) => {
            if (index === +key) {
                return {
                    ...item, ['value']: event.target.value
                }
            }
            return item;
        });
        setFinnaly(newState.reduce((sum, item) => sum + parseInt(item.value), 0));
        setScores(newState);
    }

    const submitHandler = useCallback(async event => {
        try {
            const msgFromSrv = await request('/api/model/save-score', 'POST', { modelId, finnaly }, { Authorization: `Bearer ${auth.token}` });
            toast( msgFromSrv?.message ?? 'Непонятный ответ от сервера' );
            if ( msgFromSrv.success ) {
                history.push('/');
            }
        }
        catch (e) {
            toast( e );
        }
    }, [modelId, finnaly, history, request, auth.token, toast]);

    const items = Obj.list.map((item, index) => {
        return(
            <li key={index}>
                <div className="collapsible-header">
                    <b className="teal-text text-accent-4">{item.test}</b>
                    <span className="badge range-field orange-text text-accent-3">
                        {scores[index].value}
                    </span>
                </div>
                <div className="collapsible-body">
                    <div className="row">
                        <p className="col s12">
                            <i className="teal-text text-accent-4">{item?.dect ?? 'Описание отсутствует'}</i>
                        </p>
                        <p className="range-field col s12">
                            <input type="range" min="0" max="100" value={scores[index].value} onChange={changeHandler} data-key={index} />
                        </p>
                    </div>
                </div>
            </li>
        );
    });

    useEffect(() => {
        const list = document.querySelector('ul');
        if ( !list ) return;
        window.M.Collapsible.init(list, {});
        window.M.Collapsible.getInstance(list);
        getStatus();
    }, [getStatus]);

    return(
        <div>
            <h4 className="teal-text text-accent-4">Номинация волосковая техника</h4>
            <ul className="collapsible">
                {items}
            </ul>
            <div className="row right">
                { loading && <Loader /> }
                { !loading && <button className="waves-effect waves-light btn-large" onClick={submitHandler}>Оценить с результатом {finnaly}</button> }
            </div>
        </div>
    );
}