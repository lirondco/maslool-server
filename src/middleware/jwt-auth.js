const AuthService = require("../auth/auth-service");
const ERROR = 'Unauthorised request'

function requireAuth(req, res, next) {
    const AUTHTOKEN = req.get('Authorization') || ''
    let bearerToken

    if (AUTHTOKEN.toLowerCase().startsWith('bearer ')) {
        bearerToken = AUTHTOKEN.slice(7, AUTHTOKEN.length)
    } else {
        return res.status(401).json({
            error: 'Missing bearer token'
        })
    }

    try {
        const PAYLOAD = AuthService.verifyJwt(bearerToken)

        AuthService.getUserWithUserName(
            req.app.get('db'),
            PAYLOAD.sub,
        )
        .then(user => {
            if (!user) return res.status(401).json({
                error: ERROR
            })

            req.user = user
            next()
        })
        .catch(err => {
            console.error(err)
            next(err)
        })
    } catch (error) {
        return res.status(401).json({
            error: ERROR
        })
    }
}

function requireAdmin(req, res, next) {
    if (req.user.admin === false) {
        return res.status(401).json({ error: ERROR })
      }
    
    return next()
 }

 function checkBanned(req, res, next) {
    AUTHSERVICE.getUserWithUserName(
        req.app.get('db'),
        req.body.username
    )
    .then(user => {
        if(user.banned === true) return res.status(401).json({
            error: 'User is banned'
        })
    })
    .catch(err => {
        console.error(err)
        next(err)
    })
    return next()
 }

 function requireOwner(req, res, next) {
    if (req.user.username !== 'liron') {
        return res.status(401).json({ error: ERROR })
      }
    
      return next()
 }

 module.exports = {
     requireAuth,
     requireAdmin,
     checkBanned,
     requireOwner
 }

 