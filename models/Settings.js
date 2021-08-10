const { model, Schema } = require('mongoose')

const settingsSchema = new Schema({
    name: { type: String },
    number: { type: Number },
    referees: { type: Array, of: String },
    hideReferees: { type: Array, of: String }
})

module.exports = model('Settings', settingsSchema)