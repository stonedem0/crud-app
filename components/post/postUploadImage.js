const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const requireLogin = require('../authentication/requireLogin')

const s3 = new AWS.S3({accessKeyId: process.env.AWS_ACCSSES_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCSEES_KEY})

module.exports = (app) => {
    app.get('/upload', requireLogin, (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`
        s3.getSignedUrl('putObject', {
            Bucket: 'emo-blog-platform',
            ContentType: 'image/jpeg',
            Key: key
        }, (err, url) => {
            res.send({key, url})
        })
    });
}