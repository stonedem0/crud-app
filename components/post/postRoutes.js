const mongoose = require('mongoose');
const requireLogin = require('../authentication/requireLogin');

const Post = require('./post');

module.exports = app => {

    app.get('/posts', requireLogin, async(req, res) => {
        const posts = await Post.find({user_id: req.user.id})
        res.render(__dirname + '/posts.pug', {
            title: posts[0].title,
            content: posts[0].content
        });;

    });
    app.post('/post', requireLogin, async(req, res) => {
        const {title, content} = req.body;
        const post = new Post({title:content, user_id: req.user.id});

        try {
            await post.save();
            res.send(post);

        } catch (err) {
            res.send(400, err);
        }

    });
}