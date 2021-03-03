const AUTHSERVICE = require('../auth/auth-service');

function requireAuth(req, res, next) {
    const AUTHTOKEN = req.get('Authorization') || ''

    let bearerToken
    if (AUTHTOKEN.toLowerCase().startsWith('bearer ')) {
        bearerToken = AUTHTOKEN.slice(7, AUTHTOKEN.length)
    } else {
        return res.status(401).json({
            error: 'Unauthorised request'
        })
    }

    const [tokenUserName, tokenPassword] = AUTHSERVICE.parseBasicToken(bearerToken)

    if (!tokenUserName || !tokenPassword) {
        return res.status(401).json({
            error: 'Unauthorised request'
        })
    }

    // upon return from appointment:
    // finish coding this then add verify admin and verify webmaster functions 
    // go back to auth router to add a /refresh route
    
}