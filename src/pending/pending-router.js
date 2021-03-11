const EXPRESS = require('express')
const PATH = require('path')
const { requireAuth, requireAdmin } = require('../middleware/jwt-auth')
const PENDINGSERVICE = require('./pending-service')

const PENDINGROUTER = EXPRESS.Router()
const JSONBODYPARSER = EXPRESS.json()


PENDINGROUTER
    .route('/')
    .all(requireAuth)
    .get(requireAdmin, (req, res, next) => {
        PENDINGSERVICE.getPending(req.app.get('db'))
            .then(pending => {
                return res.json(pending.map(PENDINGSERVICE.serialisePending))
            })
            .catch(next)
    })
    .post(JSONBODYPARSER, (req, res, next) => {
        const { message } = req.body;
        const NEWPENDING = { message }

        if (!req.body.message || req.body.message ===  null)
            return res.status(400).json({
                error: `Missing message in request body`
            })

        if (req.user.banned === true)
            return res.status(401).json({
                error: 'User is banned'
            })

        NEWPENDING.submitted_by_id = req.user.id

        PENDINGSERVICE.insertPending(
            req.app.get('db'),
            NEWPENDING
        )
            .then(pending => {
                res.status(201)
                    .location(PATH.posix.join(req.originalUrl, `/${pending.id}`))
                    .json(PENDINGSERVICE.serialisePending({
                        ...pending,
                        user: {
                            ...req.user
                        }
                    }))
            })
            .catch(next)
    })

PENDINGROUTER
    .route('/:pending_id')
    .all(requireAuth)
    .all(requireAdmin, (req, res, next) => {
        PENDINGSERVICE.getById(
            req.app.get('db'),
            req.params.pending_id
        )
            .then(pending => {
                if (!pending)
                    return res.status(404).json({
                        error: 'Pending message does not exist'
                    })
                res.pending = pending
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(PENDINGSERVICE.serialisePending(res.pending))
    })
    .delete((req, res, next) => {
        PENDINGSERVICE.deletePending(
            req.app.get('db'),
            req.params.pending_id
        )
            .then(() => {
                res.status(204).end()
            }) 
            .catch(next)
    })

module.exports = PENDINGROUTER