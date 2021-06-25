const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const Profile = require('../models/Profile');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = Router();

// /api/auth
router.post('/login',
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
                message: 'Некорректные данные авторизации'
            });
        }

        const {login, password} = req.body;
        const profile = await Profile.findOne({ login });
        if (!profile) return res.status(400).json({ message: 'loginError' });
        const isMatched = (password === profile.password);
        if ( !isMatched ) {
            return res.status(400).json({ message: 'passwordError' });
        }
        const token = jwt.sign(
            { profileId: profile.id },
            config.get('jwtSecret'),
            { expiresIn: '24h' }
        );
        res.status(200).json({ token, type: profile.type, descriptor: profile.descriptor, id: profile.id });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так...' });
    }
});

module.exports = router;