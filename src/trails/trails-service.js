const XSS = require('XSS');

const TRAILSSERVICE = {
    getAllTrails(db) {
        return db
            .from('trails AS trail')
            .select(
                'trail.id',
                'trail.name',
                'trail.date_published',
                'trail.website',
                'trail.description',
                'trail.safety',
                'trail.difficulty',
                db.raw(
                    `count(DISTINCT rtg) AS number_of_ratings`
                ),
                db.raw(
                    `AVG(rtg.rating) AS rating`
                ),
                db.raw(
                    `count(DISTINCT comm) AS number_of_comments`
                ),
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                            'address_line', loc.address_line,
                            'city', loc.city,
                            'region', loc.region,
                            'postal_code', loc.postal_code
                        )
                    ) AS "location"`
                ),
            ) 
            .leftJoin(
                'comments AS comm',
                'trail.id',
                'comm.trail_id',
            )
            .leftJoin(
                'ratings AS rtg',
                'trail.id',
                'rtg.trail_id',
            )
            .leftJoin(
                'locations AS loc',
                'trail.id',
                'loc.trail_id',
            )
            .groupBy('trail.id', 'loc.id')
    },

    getById(db, id) {
        return TRAILSSERVICE.getAllTrails(db)
            .where('trail.id', id)
            .first()
    },

    getCommentsForTrail(db, trail_id) {
        return db
            .from('comments AS comm')
            .select(
                'comm.id',
                'comm.content',
                'comm.last_modified',
                'comm.flagged',
                'comm.flagged_by',
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    usr.id,
                                    usr.username,
                                    usr.join_date,
                                    usr.admin,
                                    usr.banned,
                                    usr.banned_by
                            ) tmp)
                        )
                    ) AS "user"`
                )
            )
            .where('comm.trail_id', trail_id)
            .leftJoin(
                'users AS usr',
                'comm.user_id',
                'usr.id',
            )
            .groupBy('comm.id', 'usr.id')
    },

    getRatingsForTrail(db, trail_id) {
        return db
            .from('ratings AS rating')
            .select(
                'rating.id',
                'rating.rating',
                'rating.date_modified',
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    usr.id,
                                    usr.username,
                                    usr.join_date,
                                    usr.admin,
                                    usr.banned,
                                    usr.banned_by
                            ) tmp)
                        )
                    ) AS "user"`
                )
            )
            .where('rating.trail_id', trail_id)
            .leftJoin(
                'users AS usr',
                'rating.user_id',
                'usr.id',
            )
            .groupBy('rating.id', 'usr.id')
    },

    serialiseTrail(trail) {
        const { location } = trail
        const avg_rating = Number(trail.rating).toFixed(1)
        return {
            id: trail.id,
            name: XSS(trail.name),
            date_published: new Date(trail.date_published),
            website: trail.website,
            description: XSS(trail.description),
            safety: XSS(trail.safety),
            rating: Number(avg_rating),
            difficulty: trail.difficulty,
            number_of_comments: Number(trail.number_of_comments),
            number_of_ratings: Number(trail.number_of_ratings),
            location: {
                id: location.id,
                address_line: location.address_line,
                city: location.city,
                region: location.region,
                postal_code: location.postal_code
            },
        }
    },

    serialiseTrailComment(comment) {
        const { user } = comment
        return {
            id: comment.id,
            content: XSS(comment.content),
            trail_id: comment.trail_id,
            last_modified: new Date(comment.last_modified),
            flagged: comment.flagged,
            flagged_by: comment.flagged_by,
            user: {
                id: user.id,
                username: user.username,
                join_date: new Date(user.join_date),
                admin: user.admin,
                banned: user.banned,
                banned_by: user.banned_by
            },
        }
    },

    serialiseTrailRating(rating) {
        const { user } = rating
        return {
            id: rating.id,
            rating: Number(rating.rating),
            trail_id: rating.trail_id,
            date_modified: new Date(rating.date_published),
            user: {
                id: user.id,
                username: user.username,
                join_date: new Date(user.join_date),
                admin: user.admin,
                banned: user.banned,
                banned_by: user.banned_by
            },
        }
    },

    insertTrail(db, newTrail) {
        return db
            .insert(newTrail)
            .into('trails')
            .returning('*')
            .then(([trail]) => trail)
    },

    insertLocation(db, newLocation) {
        return db
            .insert(newLocation)
            .into('locations')
            .returning('*')
            .then(([location]) => location)
    },

    deleteTrail(db, id) {
        return db('trails')
            .where({ id })
            .delete()
    },

    updateTrail(db, id, newTrailFields) {
        return db('trails')
            .where({ id })
            .update(newTrailFields)
    },

    updateTrailLocation(db, trail_id, newLocationFields) {
        return db('locations')
            .where({ trail_id })
            .update(newLocationFields)
    }
}

module.exports = TRAILSSERVICE;