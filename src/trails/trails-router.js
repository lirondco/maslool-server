const EXPRESS = require('express')
const TRAILSSERVICE = require('./trails-service')
const { requireAuth, requireAdmin } = require('../middleware/jwt-auth')
const PATH = require('path')

const TRAILSROUTER = EXPRESS.Router();
const JSONBODYPARSER = EXPRESS.json();

TRAILSROUTER
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        TRAILSSERVICE.getAllTrails(req.app.get('db'))
            .then(trails => {
                if (req.user.banned === true) {
                    return res.status(400).json({
                        error: `User is banned`
                    })
                }
                res.json(trails.map(TRAILSSERVICE.serialiseTrail))
            })
            .catch(next)
    })
    .post(requireAdmin, JSONBODYPARSER, (req, res, next) => {
        const { name, website, description, safety = null, difficulty, location } = req.body
        const newTrail = { name, website, description, safety, difficulty }

        for (const field of ['name', 'website', 'description', 'difficulty', 'location'])
            if (!req.body[field] || req.body[field] == null) {
                return res.status(400).json({
                    error: `Missing ${field} in request body`
                })
            }

        for (const locfield of ['address_line', 'city', 'region', 'postal_code'])
            if (!req.body.location[locfield] || req.body.location[locfield] == null) {
                return res.status(400).json({
                    error: `Missing ${locfield} in location request body`
                })
            }


        TRAILSSERVICE.insertTrail(
            req.app.get('db'),
            newTrail
        )
            .then(trail => {
                location.trail_id = trail.id
                TRAILSSERVICE.insertLocation(
                    req.app.get('db'),
                    req.body.location
                )
                res.status(201)
                    .location(PATH.posix.join(req.originalUrl, `${trail.id}`))
                    .json(TRAILSSERVICE.serialiseTrail({
                        ...trail,
                        location: {
                            ...req.body.location
                        }
                    }))
            })
            .catch(next)
    })

TRAILSROUTER
    .route('/:trail_id')
    .all(requireAuth)
    .all(checkTrailExists)
    .get((req, res) => {
        if (req.user.banned === true) {
            return res.status(400).json({
                error: `User is banned`
            })
        }
        res.json(TRAILSSERVICE.serialiseTrail(res.trail))
    })
    .patch(JSONBODYPARSER, requireAdmin, (req, res, next) => {
        const { name, website, description, safety = null, difficulty, location } = req.body
        const TRAILTOUPDATE = { name, website, description, safety, difficulty }

        const PRESENTVALUES = Object.values(TRAILTOUPDATE).filter(Boolean)
        if (req.body.location) {
            const LOCATIONVALUES = Object.values(req.body.location).filter(Boolean)

            if (LOCATIONVALUES.length === 0) {
                return res.status(400).json({
                    error: `Location body cannot be empty and must contain at least one of address_line, city, region, postal_code`
                })
            }
            TRAILSSERVICE.updateTrailLocation(
                req.app.get('db'),
                req.params.trail_id,
                req.body.location
            )
                .then(numRowsAffected => console.log(numRowsAffected))
        }
        if (PRESENTVALUES.length === 0 && !req.body.location)
            return res.status(400).json({
                error: `Request body must contain at least one of name, website, description, safety, difficulty, location`
            })



        TRAILSSERVICE.updateTrail(
            req.app.get('db'),
            req.params.trail_id,
            TRAILTOUPDATE
        )
            .then(numRowsAffected => {
                res.status(201).json({ message: 'success' })
            })
            .catch(next)
    })
    .delete(requireAdmin, (req, res, next) => {
        TRAILSSERVICE.deleteTrail(
            req.app.get('db'),
            req.params.trail_id
        )
            .then(numRowsAffected => {
                res.status(201).json({
                    message: "success"
                })
            })
            .catch(next)
    })


TRAILSROUTER
    .route('/:trail_id/comments')
    .all(requireAuth)
    .all(checkTrailExists)
    .get((req, res, next) => {
        if (req.user.banned === true) {
            return res.status(400).json({
                error: `User is banned`
            })
        }
        TRAILSSERVICE.getCommentsForTrail(
            req.app.get('db'),
            req.params.trail_id
        )
            .then(comments => {
                res.json(comments.map(TRAILSSERVICE.serialiseTrailComment))
            })
            .catch(next)
    })

TRAILSROUTER.route('/:trail_id/ratings')
    .all(requireAuth)
    .all(checkTrailExists)
    .get((req, res, next) => {
        if (req.user.banned === true) {
            return res.status(400).json({
                error: `User is banned`
            })
        }
        TRAILSSERVICE.getRatingsForTrail(
            req.app.get('db'),
            req.params.trail_id
        )
            .then(ratings => {
                res.json(ratings.map(TRAILSSERVICE.serialiseTrailRating))
            })
            .catch(next)
    })

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


module.exports = TRAILSROUTER