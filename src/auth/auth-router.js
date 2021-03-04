const EXPRESS = require('express');
const AUTHSERVICE = require('./auth-service');
const { requireAuth } = require('../middleware/jwt-auth')
const { checkBanned } = require('../middleware/basic-auth')

const AUTHROUTER = EXPRESS.Router();
const JSONBODYPARSER = EXPRESS.json();

AUTHROUTER
    .route('/login')
    .post(JSONBODYPARSER, checkBanned, (req, res, next) => {
     const { username, password } = req.body;
     const LOGINUSER = { username, password };
     
     for (const [key, value] of Object.entries(LOGINUSER))
        if(value == null)
            return res.status(400).json({
                error:  `Missing '${key}' in request body`
            })

    AUTHSERVICE.getUserWithUserName(
        req.app.get('db'),
        LOGINUSER.username
    )
        .then(dbUser => {
            if (!dbUser)
                return res.status(400).json({
                    error: 'Incorrect username or password',
                })

            return AUTHSERVICE.comparePasswords(LOGINUSER.password, dbUser.password)
                .then(compareMatch => {
                    if (!compareMatch)
                        return res.status(400).json({
                            error: 'Incorrect username or password'
                        })

                    const SUB = dbUser.username
                    const PAYLOAD = { user_id: dbUser.id }
                    res.send({
                        authToken: AUTHSERVICE.createJwt(SUB, PAYLOAD),
                    })
                })
        })
        .catch(next)
 })

AUTHROUTER.post('/refresh', requireAuth, (req, res) => {
    const SUB = req.user.username
    const PAYLOAD = { user_id: req.user.id }
    res.send({
        authToken: AUTHSERVICE.createJwt(SUB, PAYLOAD)
    })
})

 module.exports = AUTHROUTER;