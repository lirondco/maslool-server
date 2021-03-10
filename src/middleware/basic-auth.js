const AUTHSERVICE = require('../auth/auth-service');
const ERROR = 'Unauthorised request'

function requireAuth(req, res, next) {
    const AUTHTOKEN = req.get('Authorization') || ''

    let bearerToken
    if (AUTHTOKEN.toLowerCase().startsWith('bearer ')) {
        bearerToken = AUTHTOKEN.slice(7, AUTHTOKEN.length)
    } else {
        return res.status(401).json({
            error: ERROR
        })
    }

    const [tokenUserName, tokenPassword] = AUTHSERVICE.parseBasicToken(bearerToken)

    if (!tokenUserName || !tokenPassword) {
        return res.status(401).json({
            error: ERROR
        })
    }

    AUTHSERVICE.getUserWithUserName(
        req.app.get('db'),
        tokenUserName
    )
        .then(user => {
            if (!user) return res.status(401).json({
                error: ERROR
            })

        return AUTHSERVICE.comparePasswords(tokenPassword, user.password)
            .then(hasMatch => {
                if(hasMatch) {
                    req.user = user
                    next()
                } else {
                    return res.status(401).json({
                        error: ERROR
                    })
                }
            })

        })
        .catch(err => {
            console.error(err)
            next(err)
        })
    
}

function requireAdmin(req, res, next) {
    if (req.user.admin === false) {
        return res.status(401).json({ error: ERROR })
      }
    
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
     requireOwner
 }