const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  if (blogs.length===0) {
    return 0
  }
  sum = blogs.reduce((s,element) => {return element.likes+s},0)
  return sum
}

const favoriteBlog = (blogs) => {
  let favourite
  let maxLikes = 0
  blogs.forEach(element => {
    if (maxLikes < element.likes)
    {
      favourite = element
      maxLikes = element.likes
    }
  })
  return favourite

}

module.exports = {
  dummy, totalLikes, favoriteBlog
}