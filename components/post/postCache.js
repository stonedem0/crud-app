const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.hgetall = util.promisify(client.hgetall)
client.hset = util.promisify(client.hset)
//client.hdel

client.on('connect', function () {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

exports.find = async function({ user_id }) {
  const posts = await client.hgetall(`posts:${user_id}`)
  if (!posts) return
  return Object.keys(posts).map(k => JSON.parse(posts[k]))
}

exports.set = async function({ user_id, post }) {
    const json = JSON.stringify(post)
    await client.hset(`posts:${user_id}`, post._id, json)
}

