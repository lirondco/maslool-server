const XSS = require('xss')

const COMMENTSSERVICE = {
    getById(db, id) {
        return db
            .from('comments AS comm')
            .select(
                'comm.id',
                'comm.content',
                'comm.last_modified',
                'comm.flagged',
                'comm.flagged_by',
                'comm.trail_id',
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
                'comm.user_id',
                'usr.id',
            )
            .where('comm.id', id)
            .first()
    },

    insertComment(db, newComment) {
        return db
            .insert(newComment)
            .into('comments')
            .returning('*')
            .then(([comment]) => comment)
            .then(comment => 
                COMMENTSSERVICE.getById(db, comment.id)
            )
    },

    updateComment(db, id, newCommentFields) {
        return db('comments')
            .where({ id })
            .update(newCommentFields)
    },

    deleteComment(db, id) {
        return db('comments')
            .where({ id })
            .delete()
    },

    serialiseComment(comment) {
        const { user } = comment
        return {
            id: comment.id,
            content: XSS(comment.content),
            last_modified: comment.last_modified,
            flagged: comment.flagged,
            flagged_by: comment.flagged_by,
            trail_id: comment.trail_id,
            user: {
                id: user.id,
                username: user.username,
                join_date: user.join_date,
                admin: user.admin,
                banned: user.banned,
                banned_by: user.banned_by
            },
        }
    }
}

module.exports = COMMENTSSERVICE