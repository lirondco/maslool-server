const XSS = require('xss')

const PENDINGSERVICE = {
    getPending(db) {
        return db
            .from('pending AS pend')
            .select(
                'pend.id',
                'pend.message',
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
                'pend.submitted_by_id',
                'usr.id',
            )
            .groupBy('pend.id', 'usr.id')
    },

    getById(db, id) {
        return PENDINGSERVICE.getPending(db)
            .where('pend.id', id)
            .first()
    },

    insertPending(db, newPending) {
        return db
            .insert(newPending)
            .into('pending')
            .returning('*')
            .then(([pending]) => pending)
    },

    deletePending(db, id) {
        return db('pending')
            .where({ id })
            .delete()
    },

    serialisePending(pending) {
        const { user } = pending
        return {
            id: pending.id,
            message: XSS(pending.message),
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
}

module.exports = PENDINGSERVICE