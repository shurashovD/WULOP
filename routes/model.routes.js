const {Router} = require('express');
const AuthMiddleWare = require('../middleware/auth.middleware');
const {check, validationResult} = require('express-validator');
const Model = require('../models/Model');
const Profile = require('../models/Profile');

const router = Router();

router.post(
    '/register',
    AuthMiddleWare,
    [
        check('team', 'Пустое имя участника').exists(),
        check('task', 'Не указано задание').exists(),
        check('rfid', 'Неверное значение RFID').isLength({ min: 10, max: 10 })
    ],
    async (req, res) => {
        try {
            const validationResultErrors = validationResult(req);
            if ( !validationResultErrors.isEmpty() ) return res.status(400).json({ message: validationResultErrors.array()[0] });

            const {team, task, rfid} = req.body;
            const candidate = await Model.findOne({ team, task, completed: false });
            if ( candidate ) return res.status(400).json({ message: 'Участник уже зарегистрирован в текущем задании' });

            const rfidCandidate = await Model.findOne({ rfid, completed: false });
            if ( rfidCandidate ) return res.status(400).json({ message: 'Метка занята' });

            const model = new Model({ team, task, rfid });
            await model.save();

            res.json({ message: 'Участник успешно сохранен', success: true });
        }
        catch (e) {
            console.log(e);
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
            const candidate = await Model.find({ rfid, completed: false });
            if ( !candidate ) return res.status(400).json({ message: 'Ошибка получения участника' });
            res.json({ model: JSON.stringify(candidate) });
        }
        catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так...' });
        }
    }
);

router.post(
    '/save-score',
    AuthMiddleWare,
    async (req, res) => {
        try {
            const {modelId, finnaly} = req.body;
            const model = await Model.findById(modelId);
            if ( !model ) return res.status(400).json({ message: 'Ошибка получения участника' });

            if ( !model?.scores ) {
                model.scores = new Map();
                await model.save();
            }
            model.scores.set(req.profileId, finnaly);
            if (model.scores.size == 7) model.completed = true;
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
                const scores = [];
                for ( let [key, value] of model.scores ) {
                    scores.push({
                        referee: profiles.find(profile => profile._id == key),
                        score: value
                    });
                }
                return { name: model.team, scores };
            });

            res.json({ result });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ result: [] });
        }
    }
);

module.exports = router;