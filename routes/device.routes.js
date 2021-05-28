const {Router} = require('express');
const AuthMiddleWare = require('../middleware/auth.middleware');

const router = Router();

const Devices = [
    {
        name: 'register',
        masterId: '60aa8f43602e693664ea06eb',
        slaveId: '60aa8f43602e693664ea06e9',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    },
    {
        name: 'referee_1',
        masterId: '60aa8f40602e693664ea06db',
        slaveId: '60aa8f42602e693664ea06e2',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    },
    {
        name: 'referee_2',
        masterId: '60aa8f41602e693664ea06dc',
        slaveId: '60aa8f42602e693664ea06e3',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    },
    {
        name: 'referee_3',
        masterId: '60aa8f41602e693664ea06dd',
        slaveId: '60aa8f42602e693664ea06e4',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    },
    {
        name: 'referee_4',
        masterId: '60aa8f41602e693664ea06de',
        slaveId: '60aa8f42602e693664ea06e5',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    },
    {
        name: 'referee_5',
        masterId: '60aa8f41602e693664ea06df',
        slaveId: '60aa8f42602e693664ea06e6',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    },
    {
        name: 'referee_6',
        masterId: '60aa8f41602e693664ea06e0',
        slaveId: '60aa8f42602e693664ea06e7',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    },
    {
        name: 'referee_7',
        masterId: '60aa8f41602e693664ea06e1',
        slaveId: '60aa8f42602e693664ea06e8',
        masterTimeStamp: null,
        slaveTimeStamp: null,
        status: 'OFF',
        value: null
    }
];

router.get(
    '/status',
    AuthMiddleWare,
    (req, res) => {
        const master = Devices.find(item => item.masterId == req.profileId);
        const slave = Devices.find(item => item.slaveId == req.profileId);
        if ( master ) {
            console.log(master.name);
            master.masterTimeStamp = Date.now();

            if ( master.status == 'VERIFY' ) {
                master.status = 'SUCCESS';
            }

            return res.json({ status: master.status, value: master.value });
        }

        if ( slave ) {
            slave.slaveTimeStamp = Date.now();

            if ( slave.status == 'SUCCESS' ) {
                slave.status = 'OFF';
            }

            return res.json({ status: slave.status });
        }
        
        res.status(500).json({ message: 'Устройство не определено' });
    }
);

router.post(
    '/master-init-read',
    AuthMiddleWare,
    (req, res) => {
        const device = Devices.find(item => item.masterId == req.profileId);
        if ( device ) {
            device.masterTimeStamp = Date.now();
            device.status = 'READ';
            //device.status = 'VERIFY';
            return res.json({ status: device.status });
        }
        
        res.status(500).json({ message: 'Устройство не определено' });
    }
);

router.post(
    '/slave-finish-read',
    AuthMiddleWare,
    (req, res) => {
        const device = Devices.find(item => item.slaveId == req.profileId);
        if ( device ) {
            device.slaveTimeStamp = Date.now();
            device.status = 'VERIFY';
            device.value = req.body.rfid;
            return res.json({ status: device.status });
        }
        
        res.status(500).json({ message: 'Устройство не определено' });
    }
);

module.exports = router;