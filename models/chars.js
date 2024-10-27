const { model, Schema } = require('mongoose')

module.exports = model('chars', new Schema({
  User: String,
  Harem: Object,
  Buddy: String,
  Slots: Number,
  Changelog: Boolean,
}))