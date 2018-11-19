const cache = require('./postCache')
const Post = require('./post')

// Find posts by user_id.
exports.find = async function({ user_id }) {
  console.log('Finding posts by %s', user_id)

  const posts = await cache.find({ user_id })
  if (posts) {
    console.log('Found %d posts by %s in cache', posts.length, user_id)
    return posts
  }

  return Post.find({ user_id })
}

// Save post in Mongo and Redis cache.
exports.save = async function(post) {
    await post.save()
    await cache.set({ user_id: post.user_id, post })}

