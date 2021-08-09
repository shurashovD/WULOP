const {Schema, model} = require('mongoose');

const RefereeScoreSchema = new Schema({
    commentLink: { type: String },
    testId: { type: Number },
    value: { type: Number }
});

const HyhienicalScoreSchema = new Schema({
    testId: { type: Number },
    value: { type: Number }
});

const PrevScoreSchema = new Schema({
    testId: { type: Number },
    value: { type: Number }
})

const ScoreSchema = new Schema({
    amount: { type: Number },
    refereeId: { type: String },
    refereeScores: { type: Array, of: RefereeScoreSchema } 
});

const schemaModel = new Schema({
    rfid: { type: String, required: true },
    team: { type: String, required: true },
    mail: { type: String },
    task: { type: String, required: true },
    number: { type: Number, required: true },
    beforePhoto: { type: String },
    afterPhoto: { type: String },
    hyhienicalScore: { type: Array, of: HyhienicalScoreSchema },
    hyhienicalComment: { type: String },
    prevComment: { type: String },
    prevScore: { type: Array, of: PrevScoreSchema },
    scores: { type: Array, of: ScoreSchema },
    completed: { type: Boolean, default: false }
});

module.exports = model('Model', schemaModel);