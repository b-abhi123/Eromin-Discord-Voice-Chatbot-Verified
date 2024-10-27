const { model, Schema } = require('mongoose')

module.exports = model('blacklists', new Schema({
  Password: String,
  Users: Object,
}))