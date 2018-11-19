const mongoose = require('mongoose');

const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage});
const requireLogin = require('../authentication/requireLogin');
const Post = require('./post');

const postsCached = require('./postCached')

const s3 = new AWS.S3({accessKeyId: process.env.AWS_ACCSSES_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCSEES_KEY, endpoint: 's3.eu-west-2.amazonaws.com', signatureVersion: 'v4', region: 'eu-west-2'})

module.exports = app => {

    //handling GETs requests

    app.get('/profile', requireLogin, async(req, res) => {

        const user_id = req.user.id
        const posts = await postsCached.find({ user_id })
        res.render(__dirname + '/postProfile.pug', {
            posts: posts,
            user: req.user.displayName
        });

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

    app.post('/post', requireLogin, upload.single('user-image'), async(req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`


        const {title, content} = req.body;

        // Validate input
        if (!title) {
            res.json({error: 'Title is required'})
            return
        }

        if (!content) {
            res.json({error: 'Content is required'})
            return
        }

        const post = {
            title: title,
            content: content,
            user_id: req.user.id
        } 


        console.log('Creating post')

        // has a file
        if (req.file) {
            try {
                console.log('Uploading file to %s', key)
                await uploadFile(req, key)
                post.user_image = key
            } catch (err) {
                console.error('Error uploading: %s', err)
                res.send(400, err)
                return
            }
        }

        console.log('Uploaded file')

        // post model
        const model = new Post(post);

        // has no file
        try {
            await postsCached.save(model)
            res.redirect('/profile')
        } catch (err) {
            console.error('Error saving post: %s', err)
            res.send(400, err);
        }

        console.log('Created post')
    });

    app.post('/upload', requireLogin, upload.single('avatar'), function (req, res, next) {
        console.log(req.file, req.file.mimetype)
        const key = `${req.user.id}/${uuid()}.jpeg`
        s3.putObject({
            Bucket: 'emo-blog-platform',
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            Key: key,
            ACL: 'public-read'
        }, (err, data) => {
            console.log(key, data)
            res.render(__dirname + '/postCreate.pug', {key: key})
        })
    })

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
            res.redirect('/profile');
        } catch (err) {

            res.send(err);

        }
    });

}

// Upload the request body to the given key.
function uploadFile(req, key) {
    return s3.putObject({
        Bucket: 'emo-blog-platform',
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        Key: key,
        ACL: 'public-read'
    }).promise()
}
