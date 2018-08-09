const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const config = require('./utils/config')


app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogRouter)

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})