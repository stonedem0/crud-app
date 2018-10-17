const mongoose = require('mongoose');
const Post = require('../models/Post');

module.exports = app => {
    app.post('/post', async(req, res) => {
        console.log(req.body)

        const {title, content} = req.body;
        const blog = new Post({title, content, user_id: req.user.id});

        try {
            await blog.save();
            res.send(blog);

        } catch (err) {
            res.send(400, err);
        }

     
    });
}