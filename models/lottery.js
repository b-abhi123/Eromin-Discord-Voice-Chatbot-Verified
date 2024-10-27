const { model, Schema } = require('mongoose')

module.exports = model('lottery', new Schema({
  Entry: String,
  Entries: Object,
}))