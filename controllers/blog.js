const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('./../models/blog')
const User = require('./../models/user')

blogRouter.get('/', async (request, response) => {
  let blogs = await Blog
    .find({})
    .populate("user", { name: 1, username: 1 })
  response.json(blogs.map(Blog.formatBlog))

  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
})

blogRouter.put('/:id', async (request, response) => {
  try {
    // Todo: implement so that change in schema doesn't matter!
    const updatedBlog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    }
    const upBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true } )
    response.json(Blog.formatBlog(upBlog))
  } catch (exception) {
    response.status(400).json({ error: 'malformatted id' })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    response.status(400).json({ error: 'malformatted id' })
  }
})

blogRouter.post('/', async (request, response) => {
  try {
    // Model way was:
    // const authorization = request.get('authorization') 
    // if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // if (!token || !decodedToken.id) {
    //   return response.status(401).json({ error: 'token missing or invalid' })
    //  }
    let decodedToken = null
    try {
      const tokenString = request.token//request.headers.authorization.slice(7,)
      decodedToken = jwt.verify(tokenString, process.env.SECRET)
    } catch (exception) {
      console.log(exception)
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = new Blog(request.body)
    //console.log("D-token", decodedToken)
    //console.log("IDfrom",decodedToken.id)
    const users = await User.find({})
    //console.log(users)
    const user = await User.findOne({ _id: decodedToken.id })
    //console.log(user)
    blog.user = user._id
    if (!blog.likes) {
      blog.likes = 0
    }
    if (!blog.url || !blog.title) {
      return response.status(400).json({ error: 'content missing' })
    }
    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()

    response.status(201).json(Blog.formatBlog(saved))
  } catch (exception) {
    console.log(exception)
  }
})

module.exports = blogRouter