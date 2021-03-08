const EXPRESS = require('express')
const PATH = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const TRAILSSERVICE = require('../trails/trails-service')
const RATINGSSERVICE = require('./ratings-service')

const RATINGSROUTER = EXPRESS.Router()
const JSONBODYPARSER = EXPRESS.json()

RATINGSROUTER
    .route('/:trail_id')
    .all(requireAuth)
    .post((req, res, next) => {
        TRAILSSERVICE.getRatingsForTrail(
            req.app.get('db'),
            req.params.trail_id
        )
            .then(ratings => {
                for(let i = 0; i < ratings.length; i++) {
                    if(ratings[i].user.id === req.user.id) {
                        return res.status(400).json({
                            error: `User can only rate once`
                        })
                    }
                }
                res.ratings = ratings
                next()
            })
            .catch(next)
    })
    .post(JSONBODYPARSER, checkTrailExists, (req, res, next) => {
        const { trail_id, rating, user_id } = req.body
        const NEWRATING = { rating }


        for (const [key, value] of Object.entries(NEWRATING))
            if (value == null)
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                })

        if (req.user.banned === true)
            return res.status(401).json({
                error: 'User is banned'
            })

        NEWRATING.user_id = req.user.id
        NEWRATING.trail_id = req.params.trail_id

        RATINGSSERVICE.insertRating(
            req.app.get('db'),
            NEWRATING
        )
            .then(rating => {
                res
                    .status(201)
                    .location(PATH.posix.join(req.originalUrl, `/${rating.id}`))
                    .json(RATINGSSERVICE.serialiseRating(rating))
            })
            .catch(next)
    })

RATINGSROUTER
    .route('/:rating_id')
    .all(requireAuth)
    .all((req, res, next) => {
        RATINGSSERVICE.getById(
            req.app.get('db'),
            req.params.rating_id
        )
        .then(rating => {
            if(!rating)
                return res.status(404).json({
                    error: `Rating doesn't exist`
                })
            res.rating = rating
            next()
        })
        .catch(next)
    })
    .get((req, res) => {
        if (req.user.banned === true) {
            return res.status(401).json({
                error: 'User is banned'
            })
        }
        res.json(RATINGSSERVICE.serialiseRating(res.rating))
    })
    .patch(JSONBODYPARSER, (req, res, next) => {
        const { rating, date_modified } = req.body
        const MODIFYRATING = { rating, date_modified }

        if (req.body.rating === null) 
            return res.status(400).json({
                error: `Missing rating in request body`
            })
        
        if (res.rating.user.id !== req.user.id)
        return res.status(401).json({
            error: `Rating can only be changed by author`
        })

        if (req.user.banned === true)
            return res.status(401).json({
                error: `User is banned`
            })

        MODIFYRATING.date_modified = new Date();

        RATINGSSERVICE.updateRating(
            req.app.get('db'),
            req.params.rating_id,
            MODIFYRATING
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = RATINGSROUTER

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