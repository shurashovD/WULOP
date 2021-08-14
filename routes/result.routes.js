const { Router } = require('express')
const Model = require('../models/Model')
const Profile = require('../models/Profile')
const Settings = require('../models/Settings')

const router = Router()

router.get(
    '/russia-2021',
    async (req, res) => {
        const tasks = ["1", "2", "3", "4", "5"]
        const models = await Model.find()
        const profiles = await Profile.find()
        const settingsArr = await Settings.find()

        const result = tasks.map(currTask => {
            const settings = settingsArr.find(({number}) => number === (currTask - 1))
            const completeModels = models.filter(({task}) => task === currTask).map(model => {
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
            return result
        })

        res.json(result)
    }
)

module.exports = router