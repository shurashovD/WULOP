const {Schema, model} = require('mongoose');

const RefereeScoreSchema = new Schema({
    commentLink: { type: String },
    testId: { type: Number },
    value: { type: Number }
});

const ScoreSchema = new Schema({
    amount: { type: Number },
    refereeId: { type: String },
    refereeScores: { type: Array, of: RefereeScoreSchema } 
});

const schemaModel = new Schema({
    rfid: { type: String, required: true },
    team: { type: String, required: true },
    task: { type: String, required: true },
    number: { type: Number, required: true },
    beforePhoto: { type: String },
    afterPhoto: { type: String },
    hyhienicalScore: { type: Number },
    hyhienicalComment: { type: String },
    scores: { type: Array, of: ScoreSchema },
    completed: { type: Boolean, default: false }
});

module.exports = model('Model', schemaModel);