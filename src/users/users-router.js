const PATH = require('path')
const EXPRESS = require('express')
const XSS = require('xss')
const USERSSERVICE = require('./users-service')
const AUTHSERVICE = require('../auth/auth-service')
const { requireAdmin, requireAuth, requireOwner } = require('../middleware/jwt-auth')

const USERSROUTER = EXPRESS.Router()
const JSONPARSER = EXPRESS.json()

const serialiseUser = user => ({
    id: user.id,
    email: XSS(user.fullname),
    username: XSS(user.username),
    join_date: user.join_date,
    admin: user.admin,
    banned: user.banned,
    banned_by: user.banned_by,
})

USERSROUTER
    .route('/')
    .get(requireAuth, requireAdmin, (req, res, next) => {
        USERSSERVICE.getAll(req.app.get('db'))
            .then(users => {
                res.json(users.map(serialiseUser))
            })
            .catch(next)
    })
    .post(JSONPARSER, (req, res, next) => {
        const { username, password, email } = req.body

        for (const field of ['username', 'password', 'email'])
            if (!req.body[field] || req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing ${field} in request body`
                })
            }

        const PASSWORDERROR = USERSSERVICE.validatePassword(password)

        if (PASSWORDERROR) {
            return res.status(400).json({
                error: PASSWORDERROR
            })
        }

        USERSSERVICE.hasUserWithUsername(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUsername => {
                if (hasUserWithUsername)
                    return res.status(400).json({
                        error: `Username already taken`
                    })

                return AUTHSERVICE.hashPassword(password)
            })
            .then(hashedPassword => {
                const NEWUSER = {
                    username,
                    password: hashedPassword,
                    email,
                    join_date: 'now()',
                    banned: false,
                    banned_by: null,
                    admin: false
                }

                return USERSSERVICE.insertUser(
                    req.app.get('db'),
                    NEWUSER
                )
                    .then(user => {
                        res
                            .status(201)
                            .location(PATH.posix.join(req.originalUrl, `/${user.id}`))
                            .json(serialiseUser(user))
                    })
            })
            .catch(next)
    })


USERSROUTER
    .route('/:user_id')
    .all(requireAuth)
    .all((req, res, next) => {
        USERSSERVICE.getById(
            req.app.get('db'),
            req.params.user_id
        )
            .then(user => {
                if (!user)
                    return res.status(404).json({
                        error: `User doesn't exist`
                    })
                res.user = user
                next()
                return null
            })
            .catch(next)
    })
    .get((req, res) => {
        if (res.user.id !== req.user.id)
            return res.status(400).json({
                error: 'Unauthorised access'
            })

        res.json(serialiseUser(res.user))
    })
    .patch(JSONPARSER, (req, res, next) => {
        const { email, password } = req.body
        const USERTOUPDATE = { email, password }

        const NUMBEROFVALUES = Object.values(USERTOUPDATE).filter(Boolean).length

        if (NUMBEROFVALUES === 0)
            return res.status(400).json({
                error: "Request body must contain either email, password, or username"
            })

        if (res.user.id !== req.user.id)
            return res.status(400).json({
                error: 'User can only be updated by self'
            })

        if (req.user.banned === true) {
            return res.status(400).json({
                error: `User is banned. If you think this is an error, please contact an admin.`
            })
        }

        const PASSWORDERROR = USERSSERVICE.validatePassword(USERTOUPDATE.password)

        if (PASSWORDERROR && USERTOUPDATE.password) {
            return res.status(400).json({
                error: PASSWORDERROR
            })
        }

        return USERSSERVICE.updateUser(
            req.app.get('db'),
            req.params.user_id,
            USERTOUPDATE
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })


USERSROUTER
    .route('/ban/:user_id')
    .all(requireAuth)
    .all(requireAdmin)
    .all((req, res, next) => {
        USERSSERVICE.getById(
            req.app.get('db'),
            req.params.user_id
        )
            .then(user => {
                if (!user)
                    return res.status(404).json({
                        error: `User doesn't exist`
                    })
                res.user = user
                next()
                return null
            })
            .catch(next)
    })
    .patch(JSONPARSER, (req, res, next) => {
        const { banned, banned_by } = req.body
        const USERTOBAN = { banned, banned_by }

        USERTOBAN.banned = !res.user.banned;

        if (USERTOBAN.banned === true) {
            USERTOBAN.banned_by = req.user.username
        } else {
            USERTOBAN.banned_by = null
        }

        if (res.user.admin === true) {
            return res.status(400).json({
                error: `You can't ban a fellow admin`
            })
        }

        return USERSSERVICE.updateUser(
            req.app.get('db'),
            req.params.user_id,
            USERTOBAN
        )
            .then(() => {
                res.status(201).json({
                    message: `${res.user.username} ban status is now ${USERTOBAN.banned}`
                })
            })
            .catch(next)
    })

USERSROUTER
    .route('/setadmin/:user_id')
    .all(requireAuth)
    .all(requireOwner)
    .all((req, res, next) => {
        USERSSERVICE.getById(
            req.app.get('db'),
            req.params.user_id
        )
        .then(user => {
            if (!user)
                return res.status(404).json({
                    error: `User doesn't exist`
                })
                res.user = user
                next()
                return null
        })
        .catch(next)
    })
    .patch(JSONPARSER, (req, res, next) => {
        const { admin } = req.body
        const SETADMIN = { admin }

        SETADMIN.admin = !res.user.admin
        let message

        if (SETADMIN.admin === false) {
            message = `${res.user.username}'s admin privileges have been revoked`
        } else {
            message = `${res.user.username} has been given admin privileges`
        }

        if (res.user.banned === true) {
            return res.status(400).json({
                error: `${res.user.username} is currently banned. Unban the user first`
            })
        }

        return USERSSERVICE.updateUser(
            req.app.get('db'),
            req.params.user_id,
            SETADMIN
        )
            .then(() => {
                res.status(201).json({
                    message: message
                })
            })
            .catch(next)
    })

module.exports = USERSROUTER