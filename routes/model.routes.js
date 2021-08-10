const {Router} = require('express');
const AuthMiddleWare = require('../middleware/auth.middleware');
const {check, validationResult} = require('express-validator');
const Model = require('../models/Model');
const Profile = require('../models/Profile');
const Settings = require('../models/Settings');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('config');

const router = Router();

const mail = async ({ team, mail, scores, beforePhoto, afterPhoto, hyhienicalComment }) => {
    const attachments = [];
    scores.forEach(score => {
        const { refereeScores } = score;
        refereeScores.forEach(item => {
            if ( Boolean(item.commentLink) )
            attachments.push({ path: item.commentLink });
        });
    });

    if ( Boolean(beforePhoto) ) attachments.push({ path: beforePhoto });
    if ( Boolean(afterPhoto) ) attachments.push({ path: afterPhoto });
    if ( Boolean(hyhienicalComment) ) attachments.push({ path: hyhienicalComment });

    const transporter = nodemailer.createTransport(config.transport);

    await transporter.sendMail({...config.mailData, attachments, text: config.mailData.text + ' Part ' + team + '.' });
    if (mail) await transporter.sendMail({...config.mailData, attachments, to: mail });
}

// register
router.post(
    '/register',
    AuthMiddleWare,
    [
        check('team', 'Пустое имя участника').exists(),
        check('task', 'Не указано задание').exists(),
        check('rfid', 'Неверное значение RFID').isLength({ min: 10, max: 10 }),
    ],
    async (req, res) => {
        try {
            const validationResultErrors = validationResult(req);
            if ( !validationResultErrors.isEmpty() ) {
                return res.status(400).json({ message: validationResultErrors.errors[0].msg });
            }

            const {team, task, rfid, mail} = req.body;
            const candidate = await Model.findOne({ team, task, completed: false });
            if ( candidate ) return res.status(400).json({ message: 'Participant already has registered by current task' });

            const rfidCandidate = await Model.findOne({ rfid, completed: false });
            if ( rfidCandidate ) return res.status(400).json({ message: 'RFID is busy...' });

            let number = 1;

            const allModels = await Model.find();
            if ( allModels?.length !== 0 ) {
                number = allModels.sort((a, b) => b.number - a.number)[0].number + 1;
            }

            const model = new Model({ team, mail, task, rfid, number, hyhienicalScore: [] });
            await model.save();

            res.json({ number, success: true });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// get-model
router.post(
    '/get-model',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {rfid} = req.body;
            const candidate = await Model.findOne({ rfid, completed: false });
            if ( !candidate ) return res.status(400).json({ message: 'Ошибка получения участника' });

            const profile = await Profile.findById(req.profileId)
            if ( profile.type.split('-')[0] === 'REFEREE' ) {
                const settings = await Settings.findOne({ number: candidate.task-1 })
                if ( !settings.referees.some(item => item === req.profileId) ) {
                    return res.status(400).json({ message: profile.descriptor + ' не оценивает текущую модель' });
                }
            }

            res.json({ model: JSON.stringify(candidate) });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// get-model-by-number
router.post(
    '/get-model-by-number',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {number} = req.body;
            const candidate = await Model.findOne({ number });
            if ( !candidate ) return res.status(400).json({ message: 'Ошибка получения участника' });
            res.json({ model: JSON.stringify(candidate) });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// insert-photo
router.post(
    '/insert-photo',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {id, photoKey} = req.body;
            const candidate = await Model.findById(id);
            if ( !candidate ) return res.status(400).json({ message: 'Ошибка получения участника' });
            
            if ( req.file ) candidate[photoKey] = path.join('uploads', req.file.originalname);
            else candidate[photoKey] = '';
            await candidate.save();

            const model = await Model.findById(id);
            res.json({ model });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// hyhienical-comment
router.post(
    '/hyhienical-comment',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const candidate = await Model.findById(req.body.id);
            if ( !candidate ) return res.status(400).json({ message: 'Ошибка получения участника' });
            
            if ( req.file ) candidate.hyhienicalComment = path.join('uploads', req.file.originalname);
            else candidate.hyhienicalComment = '';
            await candidate.save();

            const model = await Model.findById(req.body.id);
            res.json({ model: JSON.stringify(model) });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// referee-comment
router.post(
    '/referee-comment',
    AuthMiddleWare,
    async (req, res) => {
        try {
            if ( req.file ) res.json({ path : path.join('uploads', req.file.originalname) });
            else throw new Error();
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// get-photo
router.post(
    '/get-photo',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const { fileName } = req.body;
            res.sendFile(path.join(path.parse(__dirname).dir, '/uploads', fileName));
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// save-score
router.post(
    '/save-score',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const { modelId, amount, refereeId, refereeScores } = req.body;
            const model = await Model.findById(modelId);
            if ( !model ) return res.status(400).json({ message: 'Ошибка получения участника' });

            if ( !Boolean(model?.scores) ) model.scores = [];
            const refereeScoresIndex = model.scores.findIndex(item => item.refereeId == refereeId);
            if ( refereeScoresIndex != -1 ) model.scores.splice(refereeScoresIndex, 1);

            model.scores.push({
                amount, refereeId,
                refereeScores: JSON.parse(refereeScores)
            });

            const settings = await Settings.findOne({ number: model.task-1 })
            if (settings.referees.every(item => model.scores.some(score => score.refereeId === item))) {
                model.completed = true
                mail(model)
            }

            await model.save();

            res.json({ success: true, message: 'SUCCESS' });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// save-previous-score
router.post(
    '/save-previous-score',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const { model } = req.body
            const baseModel = await Model.findById(model._id)
            if ( !baseModel ) return res.status(400).json({ message: 'Ошибка получения участника' })

            baseModel.prevComment = model.prevComment
            baseModel.prevScore = model.prevScore
            await baseModel.save()

            res.json({ success: true, message: 'SUCCESS' })
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// get-score
router.post(
    '/get-score',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {task, inter} = req.body
            const models = await Model.find({ task })
            const profiles = await Profile.find()
            const settings = await Settings.findOne({ number: task-1 })

            const completeModels = models.map(model => {
                if (settings.referees.every(item => model.scores.some(score => score.refereeId === item)))
                return model
            }).filter(item => Boolean(item))

            const Referees = inter ? settings.referees : settings.referees.concat(settings.hideReferees)
            
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
            }).sort((a, b) => a.total - b.total)

            res.json({ result });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ result: [] });
        }
    }
);

// get-models-by-task
router.post(
    '/get-models-by-task',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {task} = req.body;
            const models = await Model.find({ task, completed: false });
            res.json({ models });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// get-models
router.post(
    '/get-models',
    AuthMiddleWare,
    async (_, res) => {
        try {
            const models = await Model.find();
            res.json({ models });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

// set-hyhienic
router.post(
    '/set-hyhienic',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {modelId, score} = req.body;
            const model = await Model.findById(modelId);
            if ( !model ) res.status(400).json({ message: 'Участник не определен' });

            model.hyhienicalScore = score;
            await model.save();
            res.json({ success: true });
        }
        catch (e) {
            res.status(500).json({ message: e.message || 'Что-то пошло не так...' });
        }
    }
);

module.exports = router;