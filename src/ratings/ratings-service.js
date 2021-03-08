const RATINGSSERVICE = {
    getById(db, id) {
        return db
            .from('ratings AS rtg')
            .select(
                'rtg.id',
                'rtg.trail_id',
                'rtg.rating',
                'rtg.date_modified',
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
            .leftJoin(
                'users AS usr',
                'rtg.user_id',
                'usr.id'
            )
            .where('rtg.id', id)
            .first()
    },

    insertRating(db, newRating) {
        return db
            .insert(newRating)
            .into('ratings')
            .returning('*')
            .then(([rating]) => rating)
            .then(rating => 
                RATINGSSERVICE.getById(db, rating.id)    
            )
    },

    updateRating(db, id, newRatingFields) {
        return db('ratings')
            .where({ id })
            .update(newRatingFields)
    },

    serialiseRating(rating) {
        const { user } = rating
        return {
            id: rating.id,
            trail_id: rating.trail_id,
            rating: Number(rating.rating),
            date_modified: new Date(rating.date_modified),
            user: {
                id: user.id,
                username: user.username,
                join_date: new Date(user.join_date),
                admin: user.admin,
                banned: user.banned,
                banned_by: user.banned_by
            },
        }
    }
}

module.exports = RATINGSSERVICE