const BCRYPT = require('bcryptjs');
const JWT = require('jsonwebtoken');
const CONFIG = require('../config');

const AUTHSERVICE = {
    getUserWithUserName(db, username) {
        return db('users')
            .where({ username })
            .first()
    },

    comparePasswords(password, hash) {
        return BCRYPT.compare(password, hash)
    },

    hashPassword(password) {
        return BCRYPT.hash(password, 12)
    },

    createJwt(subject, payload) {
        return JWT.sign(payload, CONFIG.JWT_SECRET, {
            subject,
            algorithm: 'HS256',
        })
    },

    verifyJwt(token) {
        return JWT.verify(token, CONFIG.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
}

module.exports = AUTHSERVICE;