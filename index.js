const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogRouter = require('./controllers/blog')

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})