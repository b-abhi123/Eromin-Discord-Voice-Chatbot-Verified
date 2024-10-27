const { model, Schema } = require('mongoose')

module.exports = model('balls', new Schema({
  User: String,
  Pokeballs: { type: Number, default: 5 },
  Greatballs: { type: Number, default: 3 },
  Ultraballs: { type: Number, default: 1 },
  Masterballs: { type: Number, default: 0 },
}))