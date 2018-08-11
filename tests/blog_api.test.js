const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { blogs,blogsInDb } = require('./test_helper')

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

  

  // test('all notes are returned as json by GET /api/notes', async () => {
  //   const notesInDatabase = await notesInDb()

  //   const response = await api
  //     .get('/api/notes')
  //     .expect(200)
  //     .expect('Content-Type', /application\/json/)

  //   expect(response.body.length).toBe(notesInDatabase.length)

  //   const returnedContents = response.body.map(n => n.content)
  //   notesInDatabase.forEach(note => {
  //     expect(returnedContents).toContain(note.content)
  //   })
  // })

  // test('individual notes are returned as json by GET /api/notes/:id', async () => {
  //   const notesInDatabase = await notesInDb()
  //   const aNote = notesInDatabase[0]

  //   const response = await api
  //     .get(`/api/notes/${aNote.id}`)
  //     .expect(200)
  //     .expect('Content-Type', /application\/json/)

  //   expect(response.body.content).toBe(aNote.content)
  // })

  // test('404 returned by GET /api/notes/:id with nonexisting valid id', async () => {
  //   const validNonexistingId = await nonExistingId()

  //   await api
  //     .get(`/api/notes/${validNonexistingId}`)
  //     .expect(404)
  // })

  // test('400 is returned by GET /api/notes/:id with invalid id', async () => {
  //   const invalidId = '5a3d5da59070081a82a3445'

  //   await api
  //     .get(`/api/notes/${invalidId}`)
  //     .expect(400)
  // })

  // describe('addition of a new note', async () => {

  //   test('POST /api/notes succeeds with valid data', async () => {
  //     const notesAtStart = await notesInDb()

  //     const newNote = {
  //       content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
  //       important: true
  //     }

  //     await api
  //       .post('/api/notes')
  //       .send(newNote)
  //       .expect(200)
  //       .expect('Content-Type', /application\/json/)

  //     const notesAfterOperation = await notesInDb()

  //     expect(notesAfterOperation.length).toBe(notesAtStart.length + 1)

  //     const contents = notesAfterOperation.map(r => r.content)
  //     expect(contents).toContain('async/await yksinkertaistaa asynkronisten funktioiden kutsua')
  //   })

  //   test('POST /api/notes fails with proper statuscode if content is missing', async () => {
  //     const newNote = {
  //       important: true
  //     }

  //     const notesAtStart = await notesInDb()

  //     await api
  //       .post('/api/notes')
  //       .send(newNote)
  //       .expect(400)

  //     const notesAfterOperation = await notesInDb()

  //     expect(notesAfterOperation.length).toBe(notesAtStart.length)
  //   })
  // })

  // describe('deletion of a note', async () => {
  //   let addedNote

  //   beforeAll(async () => {
  //     addedNote = new Note({
  //       content: 'poisto pyynnöllä HTTP DELETE',
  //       important: false
  //     })
  //     await addedNote.save()
  //   })

  //   test('DELETE /api/notes/:id succeeds with proper statuscode', async () => {
  //     const notesAtStart = await notesInDb()

  //     await api
  //       .delete(`/api/notes/${addedNote._id}`)
  //       .expect(204)

  //     const notesAfterOperation = await notesInDb()

  //     const contents = notesAfterOperation.map(r => r.content)

  //     expect(contents).not.toContain(addedNote.content)
  //     expect(notesAfterOperation.length).toBe(notesAtStart.length - 1)
  //   })
  // })

  // describe('when there is initially one user at db', async () => {
  //   beforeAll(async () => {
  //     await User.remove({})
  //     const user = new User({ username: 'root', password: 'sekret' })
  //     await user.save()
  //   })

  //   test('POST /api/users succeeds with a fresh username', async () => {
  //     const usersBeforeOperation = await usersInDb()

  //     const newUser = {
  //       username: 'mluukkai',
  //       name: 'Matti Luukkainen',
  //       password: 'salainen'
  //     }

  //     await api
  //       .post('/api/users')
  //       .send(newUser)
  //       .expect(200)
  //       .expect('Content-Type', /application\/json/)

  //     const usersAfterOperation = await usersInDb()
  //     expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
  //     const usernames = usersAfterOperation.map(u => u.username)
  //     expect(usernames).toContain(newUser.username)
  //   })

  //   test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
  //     const usersBeforeOperation = await usersInDb()

  //     const newUser = {
  //       username: 'root',
  //       name: 'Superuser',
  //       password: 'salainen'
  //     }

  //     const result = await api
  //       .post('/api/users')
  //       .send(newUser)
  //       .expect(400)
  //       .expect('Content-Type', /application\/json/)

  //     expect(result.body).toEqual({ error: 'username must be unique' })

  //     const usersAfterOperation = await usersInDb()
  //     expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  //   })
  // })

  afterAll(() => {
    server.close()
  })

})