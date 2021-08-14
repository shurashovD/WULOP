const { Router } = require('express')
const Model = require('../models/Model')
const Profile = require('../models/Profile')
const Settings = require('../models/Settings')

const router = Router()

router.get(
    '/russia-total',
    async (req, res) => {
        const tasks = [
            {number: "1", name: "Волосковая техника"},
            {number: "2", name: "Микроблейдинг"},
            {number: "3", name: "Эффект губной помады"},
            {number: "4", name: "Растушевка"},
            {number: "5", name: "Стрелка"}
        ]
        const models = await Model.find()
        const profiles = await Profile.find()
        const settingsArr = await Settings.find()

        let html = '<!DOCTYPE HTML><html lang="ru">'
        html += '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">'
        html += '<body><table class="table table-dark table-striped">'
        tasks.forEach(currTask => {
            html += `<p class="text-dark text-center mt-5 fs-5">Результат конкурса ${currTask.name}</p>`
            const settings = settingsArr.find(({number}) => number === (currTask.number - 1))
            const completeModels = models.filter(({task}) => task === currTask.number).map(model => {
                if (settings.referees.every(item => model.scores.some(score => score.refereeId === item)))
                return model
            }).filter(item => Boolean(item))

            const Referees = settings.referees.concat(settings.hideReferees)
                
            const result = completeModels.map(model => {
                const { team, scores, hyhienicalScore, prevScore } = model
                const hyhienical = hyhienicalScore?.reduce((sum, item) => +sum + item.value, 0) ?? 0
                const previous = prevScore?.reduce((sum, item) => +sum + item.value, 0) ?? 0
                const scoresResult = Referees.map(refereeId => {
                    const referee = profiles.find(profile => profile._id == refereeId)
                    if ( referee.type.split('-')[0] === 'REFEREE' ) {
                        const amount = scores.find(score => score.refereeId === refereeId).amount
                        return {
                            referee: referee.descriptor,
                            amount
                        }
                    }
                    if ( referee.type.split('-')[0] === 'HYHIENIC' ) {
                        return {
                            referee: referee.descriptor,
                            amount: hyhienical
                        }
                    }
                    if ( referee.type.split('-')[0] === 'PREVIOUS' ) {
                        return {
                            referee: referee.descriptor,
                            amount: previous
                        }
                    }
                    })
                    const total = scoresResult.reduce((sum, item) => +sum + item.amount, 0)
                return { team, scoresResult, total }
            }).sort((a, b) => b.total - a.total)

            html += '<table class="table table-dark table-striped">'
            result.forEach((row, index) => {
                const { team, total } = row
                html += `<tr><td class="col">${index + 1}</td><td class="col">${team}</td><td class="col">${total}</td></tr>`
            })
            html += '</table>'
        })

        html += '</body></html>'

        res.send(html)
    }
)

module.exports = router