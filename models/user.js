const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  adult: Boolean,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.formatUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    notes: user.notes,
    adult: user.adult
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User