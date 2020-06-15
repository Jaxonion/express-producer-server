const app = require('../src/app');
const supertest = require('supertest');

describe('Express App (failed cases)', () => {
    it('should return a message from GET /', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!')
    });

    it('should return 401 if nothing sent POST /api/auth/login', () => {
        return supertest(app)
            .post('/api/auth/login')
            .expect(400)
    });
    
    it('should return 401 if no info put in POST /api/auth/signup', () => {
        return supertest(app)
            .post('/api/auth/signup')
            .expect(401)
    })

    it('should return 400 if no username sent POST /api/auth/signup', () => {
        return supertest(app)
            .post('/api/auth/update')
            .expect(401)
    })
});

describe('successful', () => {
    const signUpData = {
        username: 'joseph',
        email: 'joseph@gmail.com',
        password: 'Joseph1!'
    }
    const loginData = {
        username: 'jaxon',
        password: 'Jackyman1!'
    }

    const update = {
        username: 'jaxon',
        lyrics: 'my lyrics'
    }
    it('sign up success', () => {
        return supertest(app)
            .post('/api/auth/signup')
            .send(data)
            .expect(201)
    });

    it('login', () => {
        return supertest(app)
            .post('/api/auth/login')
            .send(loginData)
            .expect(200)
    });

    it('update', () => {
        return supertest(app)
            .post('/api/auth/update')
            .send(update)
            .expect(200)
    })


});