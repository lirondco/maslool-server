const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]+/

const USERSSERVICE = {
    getAll(db) {
        return db
            .from('users')
            .select('*')
    },

    hasUserWithUsername(db, username) {
        return db('users')
            .where({ username })
            .first()
            .then(user => !!user)
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },

    getById(db, id) {
        return db
            .from('users')
            .where({ id })
            .first()
    },

    deleteUser(db, id) {
        return db('users')
            .where({ id })
            .delete()
    },

    updateUser(db, id, newUserFields) {
        return db('users')
            .where({ id })
            .update(newUserFields)
    },

    validatePassword(password) {
        if (!password) {
            return 'Must supply password'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be shorter than 72 characters'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain at least one upper case, lower case, number, and special characters'
        }
        return null
    },
 }

 module.exports = USERSSERVICE;
