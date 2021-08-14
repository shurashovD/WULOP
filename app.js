const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const config = require('config');
const path = require('path');
const nodemailer = require('nodemailer');
const model = require('./models/Model')

const PORT = config.get('port') || 5000; 
const app = express();

const storageConfig = multer.diskStorage({
    destination: (req, res, cb) => {
        cb (null, "uploads");
    },
    filename: (req, file, cb) => {
        cb (null, file.originalname);
    }
});

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

    //await transporter.sendMail({...config.mailData, attachments, text: config.mailData.text + ' Part ' + team + '.' });
    await transporter.sendMail({...config.mailData, attachments, to: 'drobot.pm@mail.ru' });
}

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        const models = await model.find()
        models.forEach(model => mail(model))
    }
    catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

app.use(multer({storage: storageConfig}).single('file'));

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/profiles', require('./routes/profile.routes'));

app.use('/api/device', require('./routes/device.routes'));

app.use('/api/model', require('./routes/model.routes'));

if ( process.env.NODE_ENV === 'production' ) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        const pathObj = path.parse(req.params['0']);
        if ( pathObj.dir === '/uploads' ) {
            return res.sendFile(path.join(__dirname, 'uploads', pathObj.base));
        }
        return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.get('*', (req, res) => {
    const pathObj = path.parse(req.params['0']);
    if ( pathObj.dir === '/uploads' ) {
        return res.sendFile(path.join(__dirname, 'uploads', pathObj.base));
    }
});

start();