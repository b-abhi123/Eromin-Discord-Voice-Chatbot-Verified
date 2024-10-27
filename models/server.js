const { model, Schema } = require('mongoose')

module.exports = model('server', new Schema({
  Server: String,
  Language: { type: String, default: 'en' },
  Accent: { type: String, default: 'en' },
  Channel: String,
}))