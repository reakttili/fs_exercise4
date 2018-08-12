const blogRouter = require('express').Router()
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
    const blog = new Blog(request.body)
    const users = await User.find({})
    blog.user = users[0]._id
    if (!blog.likes) {
      blog.likes = 0
    }
    if (!blog.url || !blog.title) {
      return response.status(400).json({ error: 'content missing' })
    }
    const saved = await blog.save()
    users[0].blogs = users[0].blogs.concat(saved._id)
    await users[0].save()

    response.status(201).json(Blog.formatBlog(saved))
  } catch (exception) {
    console.log(exception)
  }
})

module.exports = blogRouter