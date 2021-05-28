const {Schema, model, Types} = require('mongoose');

const schemaProfile = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    linked: { type: Types.ObjectId, ref: 'Profile' },
    action: { type: String },
    value: { type: Number, default: 0 },
    descriptor: { type: String }
});

module.exports = model('Profile', schemaProfile);