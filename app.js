const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

const PORT = config.get('port') || 5000; 
const app = express();

app.use(express.json({ extended: true }));

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
    }
    catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/profiles', require('./routes/profile.routes'));

app.use('/api/device', require('./routes/device.routes'));

app.use('/api/model', require('./routes/model.routes'));

if ( process.env.NODE_ENV === 'production' ) {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

start();

