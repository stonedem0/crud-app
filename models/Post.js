const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({ 
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post
