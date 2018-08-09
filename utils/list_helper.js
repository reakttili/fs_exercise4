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

module.exports = {
  dummy, totalLikes
}