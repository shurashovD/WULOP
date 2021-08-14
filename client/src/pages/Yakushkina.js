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
    const [prevRows, setPrevRows] = useState([])

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
                const test = refereeTasks.find(item => String(item.id) === String(testId)).test
                const scores = referees.map(({_id}) => 
                    model.scores.find(item => String(item.refereeId) === String(_id)).refereeScores.find(item => String(item.testId) === String(testId)).value
                )
                scores.push(scores.reduce((sum, item) => sum + item, 0))
                return {
                    testId, test, scores
                }
            })
            setRows(result)

            const prevTasks = tasks.reduce((arr, current) => arr.concat(current.preCriterion), [])
            const prevResult = model.prevScore.map(({testId, value}) => {
                const test = prevTasks.find(item => String(item.id) === String(testId)).test
                return {
                    testId, test, value
                }
            })
            setPrevRows(prevResult)
        }
    }, [referees, model])

    return (
        <div className="py-2">
            <NavBar />
            <p className="text-primary text-center">{model?.team}</p>
            {(rows.length > 0) && (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col" className="text-primary">#</th>
                            {referees.map(referee => (<th className="text-primary text-center" key={referee._id}>{referee.descriptor}</th>))}
                            <th scope="col" className="text-primary">Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({testId, test, scores}) => {
                            return (
                                <tr key={testId} className="text-primary">
                                    <th>{test}</th>
                                    { scores.map((score, index) => <td key={testId + '_' + index} className="text-center">{score}</td>) }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
            <p className="text-primary text-end">Предварительный итог {rows.reduce((sum, item) => sum + item.scores[item.scores.length-1], 0)}</p>
        </div>
    )
}