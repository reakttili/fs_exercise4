const jwt = require('jsonwebtoken')
require('dotenv').config()

const userForToken = {
  username: 'VB',
  id: '5b70608e283a1e2bfc077e8c'
}
console.log("AT LOGIN, userForTOken", userForToken)
// Username and password ok
// Generate a token to browser to save
const token = jwt.sign(userForToken, process.env.SECRET)
console.log(token)

let tokenString = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNWQ1YmJhYjcxOTM4ZjQ4ZWUwNGQiLCJpYXQiOjE1MzQwOTEyOTZ9.s4OGQSXUDh8cLYsLyG5YnTMDfzcTAJ4y-3_vZIHMAho"
tokenString = tokenString.slice(7,)
//console.log(tokenString)
const decodedToken = jwt.verify(tokenString, process.env.SECRET)
console.log(decodedToken)