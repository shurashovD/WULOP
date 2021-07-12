import React, { useContext, useState } from 'react';
import { DictionaryContext } from '../context/dictionary/dictionaryContext';
import { TasksContext } from '../context/tasks/TasksContext';
import addUserImg from '../img/add-user.svg';

export const RegFirst = ({ form, setForm, btnClkHandler }) => {
    const {tasks} = useContext(TasksContext);
    const dictionary = useContext(DictionaryContext);
    const {dg} = dictionary;
    const [btnClasses, setBtnClasses] = useState(tasks.map(() => "btn-primary"));

    const style = {
        addUserInput: {
            paddingLeft: '40px',
            backgroundImage: `url(${addUserImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10px center'
        }
    }

    const keyDownHandler = event => {
        if ( event.key === ' ' ) return;
        if ( isNaN(event.key) ) return;
        event.preventDefault();
    }

    const btnClickHandler = event => {
        setForm({...form, task: event.target.value, taskDescription: event.target.textContent });
        setBtnClasses(tasks.map((item, index) => (index.toString() === event.target.getAttribute('data-index')) ? "btn-secondary" : "btn-primary"));
    }

    return (
        <div>
            <p className="text-dark fw-bold text-center mt-4 mb-4">{dg('registration')}</p>
            <div className="col-6 mx-auto">
                <input
                    className="form-control shadow"
                    name="team"
                    value={form.team}
                    onChange={e => setForm({...form, team: e.target.value})}
                    onKeyDown={keyDownHandler}
                    placeholder={dg('enterTheNameOfTheParticipant')}
                    style={ style.addUserInput }
                />
            </div>
            <p className="text-dark fw-bold text-center mt-5 mb-4">{dg('selectContestantTask')}</p>
            <div className="col-8 mx-auto">
                <div className="row gy-4 gx-5">
                    { tasks.map((item, index) => {
                        const classList = ( (index === (tasks.length - 1)) && (tasks.length % 2 === 1) ) ? 'col-9 mx-auto' : 'col-6';
                        return (
                            <div className={classList} key={index}>
                                <button
                                    className={"btn text-white col-12 btn-shadow text-uppercase " + btnClasses[index]}
                                    value={index + 1}
                                    name="task"
                                    data-index={index}
                                    onClick={btnClickHandler}
                                >{item.name}</button>
                            </div>
                        )
                    }) }
                </div>
            </div>
            <p className="text-dark text-center mx-auto mt-5">
                    { (form.team.length > 0) && (<>{dg('participant')}: {form.team}. </>) }
                    { form.task && (<>{dg('category')}: “{form.taskDescription}”.</>) }
                </p>
            <div className="row mt-5">
                <button
                    className="btn btn-primary text-white col-3 mx-auto btn-shadow"
                    onClick={btnClkHandler}
                >
                    {dg('register')}
                </button>
            </div>
        </div>
    );
}