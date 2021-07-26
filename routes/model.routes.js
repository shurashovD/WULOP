const {Router} = require('express');
const AuthMiddleWare = require('../middleware/auth.middleware');
const {check, validationResult} = require('express-validator');
const Model = require('../models/Model');
const Profile = require('../models/Profile');
const nodemailer = require('nodemailer');
const path = require('path');
const config = require('config');

async function mail() {
    const transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "knaub.sabina@yandex.ru", // generated ethereal user
            pass: "GQZSabina" // generated ethereal password
        }
    });
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <shurashovd@yandex.ru>', // sender address
        to: "shurashovd@yandex.ru", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    console.log(info);
}

const router = Router();

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

            const model = new Model({ team, mail, task, rfid, number });
            await model.save();

            res.json({ number, success: true });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

router.post(
    '/get-model',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {rfid} = req.body;
            const candidate = await Model.findOne({ rfid, completed: false });
            if ( !candidate ) return res.status(400).json({ message: 'Ошибка получения участника' });
            res.json({ model: JSON.stringify(candidate) });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

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

            if ( model.scores.length == 7 ) {
                model.completed = true;
                if ( model.mail ) {
                    const transporter = nodemailer.createTransport(config.smtp);
                    const info = await transporter.sendMail({
                        from: '"Fred Foo 👻" <shurashovd@yandex.ru>', // sender address
                        to: "shurashovd@yandex.ru", // list of receivers
                        subject: "Hello ✔", // Subject line
                        text: "Hello world?", // plain text body
                        html: "<b>Hello world?</b>", // html body
                    });
                    console.log(info);
                }
            }

            await model.save();

            res.json({ success: true, message: 'Ваша оценка принята' });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

router.post(
    '/get-score',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {task} = req.body;
            const models = await Model.find({task, completed: true});
            const profiles = await Profile.find();
            
            const result = models.map(model => {
                const { team, scores, hyhienicalScore } = model;
                const scoresResult = scores.map(score => {
                    const { amount, refereeId } = score;
                    return {
                        referee: profiles.find(profile => profile._id == refereeId).descriptor,
                        amount
                    }
                });
                return { team, scoresResult, hyhienicalScore};
            });

            res.json({ result });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ result: [] });
        }
    }
);

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

router.post(
    '/get-models',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const models = await Model.find();
            res.json({ models });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

router.post(
    '/set-hyhienic',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {modelId, score} = req.body;
            const model = await Model.findById(modelId);
            if ( !model ) res.status(400).json({ message: 'Участник не определен' });

            model.hyhienicalScore = parseInt(score);
            await model.save();
            res.json({ success: true });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

mail();

module.exports = router;