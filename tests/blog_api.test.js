const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { blogs,blogsInDb, usersInDb } = require('./test_helper')

//npx jest -t 'Test postin'
//https://jestjs.io/docs/en/expect
// toContain
// toCotainEqual
// beforeEach vs beforeAll

describe('when there is initially some blogs saved', async () => {
  beforeEach(async () => {
    const initialBlogs = blogs
    await Blog.remove({})
    const noteObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(noteObjects.map(b => b.save()))
    await User.remove({})
  })

  test('notes are returned as json', async () => {
    const initialBlogs = blogs
    const response = await api
      .get('/api/blogs')
      .expect(200) 
      .expect('Content-Type', /application\/json/)
    expect(response.body.length).toBe(initialBlogs.length)
    const returnedContents = response.body.map(n => n.content)
    initialBlogs.forEach(note => {
      //console.log(note)
      expect(returnedContents).toContain(note.content)
    })
  })
  test('Basic post test', async () => {
    let blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'FPGA',
      author: 'Young Chan',
      url: 'https://fpga.com/',
      likes: 3
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)  //Note: send function!
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await blogsInDb()
    expect(response.body.title).toEqual(newBlog.title)
    expect(blogsAfterPost.length).toBe(blogsAtStart.length + 1)
  })
  test('Likes missing', async () => {
    let blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'FPGA',
      author: 'Young Chan',
      url: 'https://fpga.com/',
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)  //Note: send function!
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await blogsInDb()
    const newblog = await blogsAfterPost.find(blog => blog.title==='FPGA')
    //console.log(newblog)
    expect(newblog.likes).toEqual(0)
  })
  test('Bad request post', async () => {
    // Note: three separate tests should be done, but hope it is not necassary?
    let blogsAtStart = await blogsInDb()
    let newBlog = {
      //title: 'FPGA',
      author: 'Young Chan',
      //url: 'https://fpga.com/',
      likes: 5
    }
    let response = await api
      .post('/api/blogs')
      .send(newBlog)  //Note: send function!
      .expect(400)    // Bad request 
      .expect('Content-Type', /application\/json/)
    let blogsAfterPost = await blogsInDb()
  })
 
  test('Delete test', async () => {
    let blogsAtStart = await blogsInDb()
    let response = await api
      .delete('/api/blogs/5a422bc61b54a676234d17fc')
      .expect(204)
    let blogsAfterDelete = await blogsInDb()
    expect(blogsAfterDelete).not.toContainEqual(blogsAtStart[6]) // Not  good way. Change so that others test have no effect
  })

  test('Update test', async () => {
    let blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart.find(blog => { return blog.title === 'React patterns'} )
    blogToUpdate.likes = 24
    let response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send(blogToUpdate)
    let blogsAfter = await blogsInDb()
    const updated = blogsAfter.find(blog => { return blog.title === 'React patterns'} )
    expect(updated.likes).toEqual(24)
  })

  // Laajenna käyttäjätunnusten luomista siten, että salasanan tulee olla vähintään 3 
  // merkkiä pitkä ja käyttäjätunnus on järjestelmässä uniikki. 
  // Jos täysi-ikäisyydelle ei määritellä luotaessa arvoa, on se oletusarvoisesti true.
  // Luomisoperaation tulee palauttaa sopiva statuskoodi ja kuvaava virheilmoitus, 
  // jos yritetään luoda epävalidi käyttäjä.
  // Tee testit, jotka varmistavat, että virheellisiä käyttäjiä ei luoda, 
  // ja että virheellisen käyttäjän luomisoperaatioon vastaus on järkevä 
  // statuskoodin ja virheilmoituksen osalta.

  test('Add user', async () => {
    //let blogsAtStart = await usersInDb()

    const newUser = {
      username: 'VB',
      name: 'Ville',
      password: 'salis'
      //passwordHash: String,
      //adult: Boolean,
      //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
    }
    const response = await api
      .post('/api/users')
      .send(newUser)  //Note: send function!
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const usersAfterPost = await blogsInDb()
    console.log(usersAfterPost)
    //expect(response.body.title).toEqual(newBlog.title)
    //expect(blogsAfterPost.length).toBe(blogsAtStart.length + 1)
  })
  
  afterAll(() => {
    console.log('Close the server.')
    server.close()
  })

})