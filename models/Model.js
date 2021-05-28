const {Schema, model} = require('mongoose');

const schemaModel = new Schema({
    rfid: { type: String, required: true },
    team: { type: String, required: true },
    task: { type: String, required: true },
    photos: { type: Map, of: [String] },
    hyhienical: {type: Number},
    scores: { type: Map, of: String },
    completed: { type: Boolean, default: false }
});

module.exports = model('Model', schemaModel);