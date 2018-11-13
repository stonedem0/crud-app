const app = require('../index')
const chai = require('chai');
const request = require('supertest');
const passportMock =require('./passport-mock')
const expect = chai.expect;

describe('GET /posts', () => {
    it('respond with 401 "Unauthorized"', function (done) {
        request(app)
            .get('/posts')
            .expect(401, done);
            done();
    });
});