import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { TasksContext } from '../context/tasks/TasksContext'
import { NavBar } from '../components/Navbar'

export const Yakushkina = () => {
    const { request } = useHttp()
    const auth = useContext(AuthContext)
    const { tasks } = useContext(TasksContext)
    const [model, setModel] = useState()
    const [referees, setReferees] = useState([])
    const [rows, setRows] = useState([])

    const getModel = useCallback( async () => {
        try {
            const msgFromSrv = await request('/api/model/get-model-by-number', 'POST', { number: '62' }, { Authorization: `Bearer ${auth.token}` })
            setModel(JSON.parse(msgFromSrv.model))
        }
        catch (e) {
            console.log(e)
        }
    }, [auth.token, request])

    const getReferee = useCallback( async refereeId => {
        try {
            const msgFromSrv = await request('/api/profiles/get-referee-by-id', 'POST', { refereeId }, { Authorization: `Bearer ${auth.token}` })
            setReferees(state => state.concat(msgFromSrv))
        }
        catch (e) {
            console.log(e)
        }
    }, [auth.token, request])

    useEffect(() => {
        if ( !model && auth.token ) {
            getModel()
        }
    }, [model, getModel, auth])

    useEffect(() => {
        if ( model ) {
            model.scores.forEach(score => getReferee(score.refereeId))
        }
    }, [model, getReferee])

    useEffect(() => {
        if ( referees.length === 5 ) {
            const refereeTasks = tasks.reduce((arr, current) => arr.concat(current.list), [])
            const result = model.scores[0].refereeScores.map(({testId}) => {
                test = refereeTasks.find(item => item.id === testId).test
                return {
                    testId, test 
                }
            })
            setRows(result)
        }
    }, [referees, model])

    return (
        <div className="py-2">
            <NavBar />
            <p className="text-primary text-center">{model?.team}</p>
            {(referees.length === 5) && (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" className="text-primary">#</th>
                            {referees.map(referee => (<th className="text-primary" key={referee._id}>{referee.descriptor}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {model.scores.map(score => {
                            const { refereeId, refereeScores } = score
                            return (
                                <tr key={score._id}>
                                    <th>1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )
}