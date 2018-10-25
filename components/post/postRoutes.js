const mongoose = require('mongoose');

const requireLogin = require('../authentication/requireLogin');
const Post = require('./post');

module.exports = app => {

    app.get('/posts', requireLogin, async(req, res) => {
   
        
        const posts = await Post.find({user_id: req.user.id}).cache();
        res.send(posts);
       

    });
    app.post('/post', requireLogin, async(req, res) => {
        const {title, content} = req.body;
        if (title && content) {
            const post = new Post({title: title, content: content, user_id: req.user.id});

            try {
                await post.save();
                res.send(post);

            } catch (err) {
                res.send(400, err);
            }
        }
        res.json({'error': 'title and content cannot be empty'})

    });
}