const app = require('../index')
const chai = require('chai');
const request = require('supertest');
const passportMock = require('./passport-mock')
const expect = chai.expect;
const should = chai.should();

process.env.NODE_ENV = 'test';

describe('POST and GET /protected-resource authorized', function () {
    beforeEach(function (done) {
        passportMock(app, {
            passAuthentication: true,
            userId: 1
        });
        request(app)
            .get('/mock/login')
            .expect(302, done)
    })

    it('should allow access to /protected-resource', function (done) {

        request(app)
            .post('/post')
            .type('form')
            .send({name: 'lem'})
            .set('Accept', /application\/json/)
            .expect(200)
            .end((err, req, res) => {
                res
                    .body
                    .should
                    .be
                    .a('object');
            });
        done();
    });
    it('should allow access to /protected-resource', function (done) {

        request(app)
            .get('/posts')
            .expect(200)
        done();
    });
});
