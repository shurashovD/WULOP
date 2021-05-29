import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useToast } from '../hooks/toast.hook';

export const HyhienicPage = () => {
    const auth = useContext(AuthContext);
    const toast = useToast();
    const {request, loading} = useHttp();
    const [task, setTask] = useState(1);
    const [models, setModels] = useState([]);
    const [modelId, setModelId] = useState(0);
    const [score, setScore] = useState(0);

    const Range = () => {
        return(
            <p className="range-field mt-5">
                <input type="range" min={0} max={100} value={score} onChange={event => setScore(event.target.value)} />
            </p>
        );
    }

    const ModelsSelect = () => {
        if ( models.length === 0 ) return null;

        const options = models.map(item => {
            return <option value={item._id} key={item._id}>{item.team}</option>
        });

        return(
            <select className="browser-default" value={modelId} onChange={changeHandler} name="task">
                <option value="0" disabled>Участник</option>
                {options}
            </select>
        );
    }

    const changeHandler = event => {
        setModelId(event.target.value);
        setScore(models.find(item => item._id === event.target.value).hyhienical);
    }

    const submitHandler = useCallback( async () => {
        try {
            const msgFromSrv = await request('/api/model/set-hyhienic', 'POST', {modelId, score}, { Authorization: `Bearer ${auth.token}` });
            if ( msgFromSrv?.success ) {
                toast('Оценка сохранена');
                setModelId(0);
                setScore(0);
                return;
            }
            throw new Error('Ошибка сохранения');
        }
        catch (e) {
            toast(e);
        }
    }, [request, auth.token, toast, modelId, score]);

    const getModels = useCallback( async () => {
        try {
            const msgFromSrv = await request('/api/model/get-models', 'POST', {task}, { Authorization: `Bearer ${auth.token}` });
            setModels(msgFromSrv?.models ?? []);
        }
        catch (e) {}
    }, [request, auth.token, task]);

    useEffect(() => {
        getModels();
    }, [task, getModels]);

    return(
        <div>
            <select className="browser-default" value={task} onChange={event => setTask(event.target.value)} name="task">
                <option value="0" disabled>Конкурсное задание</option>
                <option value="1">Эффект губной помады</option>
                <option value="2">Стрелка с прокрасом межресничного пространства и Растушевкой</option>
                <option value="3">Растушевка</option>
                <option value="4">Микроблейдинг</option>
                <option value="5">Bолосковая техника</option>
            </select>
            <ModelsSelect />
            { (modelId !== 0) && <Range /> }
            { (modelId !== 0) && <button className="waves-effect waves-light btn-large mt-5" onClick={submitHandler} disabled={loading}>Сохранить результат {score}</button> }
        </div>
    );
}