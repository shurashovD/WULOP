import React, { useCallback, useContext, useEffect, useState } from 'react'
import { TasksContext } from '../context/tasks/TasksContext'
import { useHttp } from '../hooks/http.hook'

export const Result = () => {
    const { tasks } = useContext(TasksContext)
    const {request} = useHttp()
    const [result, setResult] = useState([])

    const getScores = useCallback( async () => {
        if ( result.length === 0 ) {
            try {
                const msgFromSrv = await request('/api/result/russia-2021')
                setResult(msgFromSrv)
            }
            catch (e) {
                console.log(e);
            }
        }
    }, [request])

    useEffect(getScores, [getScores])

    return (
        <div>
            {
                result.map((item, index) => (
                    <>
                        <p className="text-dark fs-4 text-center mt-4">Результат конкурса {tasks[index].name}</p>
                        <table key={index} className="table table-dark table-striped mt-0 mb-5">
                            <tbody>
                            {
                                item.map(({team, total}, i) => (
                                    <tr key={index + team}><td>{i + 1}</td><td>{team}</td><td>{total}</td></tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </>
                ))
            }
        </div>
    )
}