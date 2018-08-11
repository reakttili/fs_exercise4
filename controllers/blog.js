const mongoose = require('mongoose')
const blogRouter = require('express').Router()
require('dotenv').config()
const mongoUrl =  process.env.MONGODB_URI
mongoose.connect(mongoUrl)
const Blog = require('./../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.likes) {
    blog.likes = 0
  }
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => {console.log(error)})
})

module.exports = blogRouter