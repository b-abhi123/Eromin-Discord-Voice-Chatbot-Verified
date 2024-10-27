const { model, Schema } = require('mongoose')

module.exports = model('slots', new Schema({
  User: String,
  Slots: Number
}))