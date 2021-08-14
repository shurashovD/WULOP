const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const bcript = require('bcryptjs');
const Profile = require('../models/Profile');
const router = Router();
const AuthMiddleWare = require('../middleware/auth.middleware');

router.get('/', AuthMiddleWare, async () => {});

router.post(
    '/create',
    AuthMiddleWare,
    [
        check('login', 'Пустой логин').exists(),
        check('password', 'Короткий пароль').isLength({min: 4})
    ],
    async (req, res) => {
    try {
        const validationResultErrors = validationResult(req);

        if ( !validationResultErrors.isEmpty() ) {
            return res.status(400).json({
                errors: validationResultErrors.array(),
                message: 'Некорректные данные регистрации'
            });
        }

        const {login, password, type} = req.body;
        const candidate = await Profile.findOne({ login });
        if ( candidate ) return res.status(400).json({ message: 'Логин занят' });

        const hashedPass = await bcript.hash(password, 12);
        const profile = new Profile({ login, password: hashedPass, type });
        await profile.save();

        res.status(201).json({ message: 'Профиль создан' });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }

});

router.post(
    '/get-referee-by-id',
    AuthMiddleWare,
    async (req, res) => {
    try {
        const { refereeId } = req.body
        const referee = await Profile.findById(refereeId)
        if ( !referee ) return res.status(400).json({ message: 'Судья не найден' })
        res.status(200).json(referee)
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }

});

module.exports = router;