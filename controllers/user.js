const mongoose = require('mongoose')
const userRouter = require('express').Router()
const User = require('./../models/user')
require('dotenv').config()
const mongoUrl =  process.env.MONGODB_URI
mongoose.connect(mongoUrl)
const Blog = require('./../models/blog')

userRouter.post('/',(request, response) => {
  console.log("posted a user!")
  response.status(200).end()
  // Tehdään tietokanta, johon käyttäjä tallennetaan!
})

module.exports = userRouter