const XSS = require('xss')

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
                'user.id'
            )
            .where('rtg.id', id)
            .first()
    }
}