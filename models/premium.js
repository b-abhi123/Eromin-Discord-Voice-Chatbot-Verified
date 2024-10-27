const { model, Schema } = require('mongoose')

module.exports = model('premium', new Schema({
  User: String,
  Talk: Number,
  HuntCount: Number,
  Sacrified: Boolean,
  Claims: Number,
  Votes: Number,
  Events: Number,
  Battles: Number,
  Hunted: Boolean
}))