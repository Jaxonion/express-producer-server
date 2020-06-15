const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();
const AuthService = require('./auth-service');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const app = express()

router
    .route('/signup')
    .post((req, res, next) => {
        const { username, email, password } = req.body;
        console.log('username:', username, 'email:', email, 'password:', password)
        if (!username || !email || !password) {
            return res.status(401).json({
                error: `Missing username, email or password`
            })
        }
        const passwordError = AuthService.validatePassword(password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }
        console.log('username:', username)
        AuthService.hasUserWithUserName(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUserName => {
                if(hasUserWithUserName) {
                    return res.status(401).json({
                        error: 'username already being used'
                    })
                }
                AuthService.hasUserWithEmail(
                    req.app.get('db'),
                    email
                )
                    .then(hasUserWithEmail => {
                        if(hasUserWithEmail) {
                            return res.status(401).json({
                                error: 'email already being used'
                            })
                        }
                        return AuthService.hashPassword(password)
                            .then(hashedPassword => {
                                const newUser = {
                                    username,
                                    email,
                                    password: hashedPassword
                                }
                                console.log('newuserzzz', newUser)
                                return AuthService.createUser(
                                    req.app.get('db'),
                                    newUser
                                )
                                    .then(user => {
                                        res
                                            .status(201)
                                            .location(path.posix.join(req.originalUrl))
                                            .json(AuthService.serializeUser(user))
                                    })
                            })
                    })
            })
    })
    .get((req, res, next) => {
        res.send('signup')
    })

router
    .route('/login')
    
    .post((req, res, next) => {
        const { username, password } = req.body;
        const userInfo = { username, password };
        if (!username || !password) {
            return res.status(400).json({
                error: 'missing fields'
            })
        }
        AuthService.userExists(
            req.app.get('db'),
            username
        )
            .then(user => {
                if(!user) {
                    return res.status(401).json({
                        error: 'username or password incorrect'
                    })
                }
                const userData = {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                }
                bcrypt.compare(password, user.password, (err, result) => {

                    if (!result) {
                        return res.status(401).json({
                            error: 'incorrect password'
                        })
                    }
                    if ( result ) {
                        jwt.sign(userData, JWT_SECRET, {expiresIn: '1m'}, (err, token) => {
                            if (err){
                                res.statusMessage = err.message;
                                return res.status(400).end();
                            }
                            return res.status(200).json({ 
                                token,
                                lyrics: userData.lryics
                            });
                        })
                    }
                })
            })
    })

    .get((req, res, next) => {
        let token = req.headers.sessiontoken;

        console.log(req.params)

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if(err) {
                res.statusMessage = "Your session has expired, log in again";
                return res.status( 409 ).end();
            }

            return res.status( 200 ).json({
                username: decoded.username,
                lyrics: decoded.lyrics
            })
        })
    })

router
    .route('/update')
    
    .post((req, res, next) => {
        const { username, lyrics } = req.body;
        let token = req.headers.sessiontoken;
        if (!username || username.length < 1 || !token) {
            return res.status(401).json({
                error: 'need to log in'
            })
        }
        jwt.verify(token, JWT_SECRET, (err, decode) => {
            if(err) {
                res.statusMessage = 'login timeout'
                return res.status(401).end()
            }
            AuthService.updateLyrics(
                req.app.get('db'),
                username,
                lyrics
            )
                .then(response => {
                    console.log(response)
                    return res.status(200).json({
                        message: 'updated lyrics'
                    })
                })
        })
    })
module.exports = router;