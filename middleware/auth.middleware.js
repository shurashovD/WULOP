const jwtLib = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if ( req.method === 'OPTIONS' ) {
        return next();
    }

    try {
        const token  = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' });
        }
        req.profileId = jwtLib.verify(token, config.get('jwtSecret')).profileId;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Нет авторизации' });
    }
}