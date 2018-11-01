const mongoose = require('mongoose');

const requireLogin = require('../authentication/requireLogin');
const Post = require('./post');

module.exports = app => {

    //handling GETs requests

    app.get('/profile', requireLogin, async(req, res) => {

        const posts = await Post.find({user_id: req.user.id})
        // posts.map( (post, index) => {     console.log(index, " : ", post.content) })
        console.log('posts: ', posts)
        res.render(__dirname + '/postProfile.pug', {posts: posts, user: req.user.displayName});

    });

    app.get('/posts/:id', requireLogin, async(req, res) => {
        const id = req.params.id
        console.log(id)
        const post = await Post.findById(id)
        console.log(post)
        res.send(post)

    })

    app.get('/posts/edit/post/:id', requireLogin, async(req, res) => {
        const id = req.params.id
        const post = await Post.findById(id)
        res.render(__dirname + '/postEdit.pug', {post: post})

        // res.render(__dirname + '/editPost.pug')
    })

    app.get('/post/create', requireLogin, (req, res) => {
        res.render(__dirname + '/postCreate.pug')
    })

    //handling POST requests

    app.post('/post', requireLogin, async(req, res) => {
        const {title, content} = req.body;
        if (title && content) {
            const post = new Post({title: title, content: content, user_id: req.user.id});

            try {
                await post.save();
                res.redirect('/profile')

            } catch (err) {
                res.send(400, err);
            }
        }
        res.json({'error': 'title and content cannot be empty'})

    });

    //handling PUT requeset

    app.put('/posts/:id', requireLogin, async(req, res) => {
        let id = req.params.id
        try {
            const newPost = await Post.findByIdAndUpdate(id, req.body, {new: true})
            res.send(newPost);
        } catch (err) {

            res.send(500, err);

        }
    });

    //handling DELETE requeset

    app.delete('/posts/:id', async(req, res) => {
        let id = req.params.id
        try {
            await Post.findByIdAndRemove(id)
            res.send('Post successfully deleted');
        } catch (err) {

            res.send(err);

        }
    });

}