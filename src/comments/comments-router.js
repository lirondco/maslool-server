const EXPRESS = require('express')
const PATH = require('path')
const { requireAuth, requireAdmin } = require('../middleware/jwt-auth')
const TRAILSSERVICE = require('../trails/trails-service')
const COMMENTSSERVICE = require('./comments-service')

const COMMENTSROUTER = EXPRESS.Router()
const JSONBODYPARSER = EXPRESS.json()

COMMENTSROUTER
    .route('/:trail_id')
    .all(requireAuth)
    .post(JSONBODYPARSER, checkTrailExists, (req, res, next) => {
        const { trail_id, content, user_id } = req.body
        const NEWCOMMENT = { trail_id, content, user_id }

        NEWCOMMENT.trail_id = req.params.trail_id

        for (const [key, value] of Object.entries(NEWCOMMENT))
            if (value === null)
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                })
        if (req.user.banned === true) {
            return res.status(401).json({
                error: `User is banned`
            })
        }

        NEWCOMMENT.user_id = req.user.id

        COMMENTSSERVICE.insertComment(
            req.app.get('db'),
            NEWCOMMENT
        )
            .then(comment => {
                res
                    .status(201)
                    .location(PATH.posix.join(req.originalUrl, `/${comment.id}`))
                    .json(COMMENTSSERVICE.serialiseComment(comment))
            })
            .catch(next)
    })

COMMENTSROUTER
    .route('/flagged')
    .all(requireAuth)
    .get(requireAdmin, (req, res, next) => {
        COMMENTSSERVICE.getFlagged(req.app.get('db'))
            .then(comments => {
                res.json(comments.map(COMMENTSSERVICE.serialiseComment))
            })
            .catch(next)
    })

COMMENTSROUTER
    .route('/:comment_id')
    .all(requireAuth)
    .all((req, res, next) => {
        COMMENTSSERVICE.getById(
            req.app.get('db'),
            req.params.comment_id
        )
            .then(comment => {
                if (!comment)
                    return res.status(404).json({
                        error: `Comment doesn't exist`
                    })
                res.comment = comment
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        if (req.user.banned === true) {
            return res.status(401).json({
                error: `User is banned`
            })
        }
        res.json(COMMENTSSERVICE.serialiseComment(res.comment))
    })
    .patch(JSONBODYPARSER, (req, res, next) => {
        const { content, last_modified } = req.body
        const NEWCOMMENTFIELDS = { content, last_modified }

        if (req.body.content === null)
            return res.status(400).json({
                error: `Missing content in request body`
            })
        if (res.comment.user.id !== req.user.id && req.user.admin === false)
            return res.status(401).json({
                error: `Comment can only be updated by author or admin`
            })

        if (req.user.banned === true) {
            return res.status(401).json({
                error: `User is banned`
            })
        }


        NEWCOMMENTFIELDS.last_modified = new Date();

        COMMENTSSERVICE.updateComment(
            req.app.get('db'),
            req.params.comment_id,
            NEWCOMMENTFIELDS
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        if (res.comment.user.id !== req.user.id && req.user.admin === false)
            return res.status(401).json({
                error: `Comment can only be deleted by author or admin`
            })

        if (req.user.banned === true) {
            return res.status(401).json({
                error: `User is banned`
            })
        }

        COMMENTSSERVICE.deleteComment(
            req.app.get('db'),
            req.params.comment_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

COMMENTSROUTER
    .route('/flag/:comment_id')
    .all(requireAuth)
    .all((req, res, next) => {
        COMMENTSSERVICE.getById(
            req.app.get('db'),
            req.params.comment_id
        )
            .then(comment => {
                if (!comment)
                    return res.status(404).json({
                        error: `Comment doesn't exist`
                    })
                res.comment = comment
                next()
            })
            .catch(next)
    })
    .patch(JSONBODYPARSER, (res, req, next) => {
        const { flagged, flagged_by } = req.comment
        const FLAGGEDFIELDS = { flagged, flagged_by }
        if(req.req.user.banned === true) {
            return res.res.status(401).json({
                error: `User is banned`
            })
        }

        if(res.res.comment.flagged === false) {
            if(req.req.user.id === res.res.comment.user.id) {
                return res.res.status(400).json({
                    error: `User cannot flag own comment`
                })
            }
            FLAGGEDFIELDS.flagged = true
            FLAGGEDFIELDS.flagged_by = req.req.user.username
        }
        
        if(res.res.comment.flagged === true) {
            if(req.req.user.admin === false) {
                return res.res.status(401).json({
                    error: `Only an admin can unflag a comment`
                })
            }
            FLAGGEDFIELDS.flagged = false
            FLAGGEDFIELDS.flagged_by = null
        }
        
        COMMENTSSERVICE.updateComment(
            req.app.get('db'),
            req.req.params.comment_id,
            FLAGGEDFIELDS
        )
         .then(() => {
             res.res.status(201).json({ message: 'success'})
         })
         .catch(next)
    })

module.exports = COMMENTSROUTER

async function checkTrailExists(req, res, next) {
    try {
        const TRAIL = await TRAILSSERVICE.getById(
            req.app.get('db'),
            req.params.trail_id
        )

        if (!TRAIL)
            return res.status(404).json({
                error: `Trail doesn't exist`
            })

        res.trail = TRAIL
        next()
    } catch (error) {
        next(error)
    }
}