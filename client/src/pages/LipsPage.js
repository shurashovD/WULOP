import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useHistory } from 'react-router';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';

const Obj = {
        task: 1,
        name: 'Эффект губной помады',
        list: [
            {
                test: 'Гармоничность образа',
                dect: 'Оценивается общий вид модели: опрятность, чистота, ухоженность. Также оценивается на сколько конкурсант подчеркнул индивидуальность. Правильно подобранное визажное решение.'
            },
            {
                test: 'Форма',
                dect: 'Оценивается соответствие формы анатомическим особенностям строения лица, излишний выход за контур. Также насколько участник корректно и естественно подобрал форму для модели.'
            },
            {
                test: 'Цвет',
                dect: 'Оценивается гармоничное сочетание выбранных цветов пигмента по тону кожи модели.'
            },
            {
                test: 'Симметрия',
                dect: 'Оценивается насколько участник смог выровнить природную асимметрию исходя из анатомических исходных данных модели.'
            },
            {
                test: 'Контур',
                dect: 'Оценивается равномерность прокраса контура. Ровность линии контура. Правильный выбор типа контура (мало видный - средне видный - четко видный). Под индивидуальную форму губ модели (большие, маленькие и т.д.)'
            },
            {
                test: 'Прокрас',
                dect: 'Оценивается равномерный плотный прокрас по всей площади губ.'
            },
            {
                test: 'Травматизация',
                dect: 'Оценивается наличие засаженных точек, отека, проколов в виде тире, явное углубление, выходы за контур губ. <b>Чем меньше этих признаков тем выше балл.</b>'
            },
            {
                test: 'Сложность работы',
                dect: 'Оценивается сложность техники введения пигмента, а также кожа модели, использование перехода цветов.'
            },
            {
                test: 'Равномерность прокраса',
                dect: 'Одинаковое количество пикселей по контуру, общий вид растушевки.'
            }
        ]
    }

export const LipsPage = () => {
    const auth = useContext(AuthContext);
    const toast = useToast();
    const history = useHistory();
    const [scores, setScores] = useState(new Object(Obj.list));
    const [finnaly, setFinnaly] = useState(0);
    const [modelId, setModelId] = useState(null);
    const {loading, request} = useHttp();

    const getStatus = useCallback (async () => {
        try {
            const msgFromSrv = await request('/api/device/status', 'GET', null, { Authorization: `Bearer ${auth.token}` });
            const rfid = msgFromSrv.value;
            const data = await request('/api/model/get-model', 'POST', { rfid }, { Authorization: `Bearer ${auth.token}` });
            if ( data?.model ) {
                const model = JSON.parse(data.model)[0];
                setModelId(model._id);
                return;
            }
            throw new Error('Ошибка получения участника');
        }
        catch (e) {
            toast(e);
            history.push('/');
        }
    }, [request, auth.token, toast]);

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
    }, [modelId, finnaly, history]);

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
    }, []);

    return(
        <div>
            <h4 className="teal-text text-accent-4">Номинация эффект губной помады</h4>
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