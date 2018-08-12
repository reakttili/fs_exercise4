const blogRouter = require('express').Router()
const Blog = require('./../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
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
  console.log("@Delete")
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    response.status(400).json({ error: 'malformatted id' })
  }
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.likes) {
    blog.likes = 0
  }
  if (!blog.url || !blog.title) {
    return response.status(400).json({ error: 'content missing' })
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => {console.log(error)})
})

module.exports = blogRouter