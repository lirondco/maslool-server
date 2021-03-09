require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const AUTHROUTER = require('./auth/auth-router')
const USERSROUTER = require('./users/users-router')
const TRAILSROUTER = require('./trails/trails-router')
const COMMENTSROUTER = require('./comments/comments-router')
const RATINGSROUTER = require('./ratings/ratings-router')
const PENDINGROUTER = require('./pending/pending-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/auth', AUTHROUTER)
app.use('/api/users', USERSROUTER)
app.use('/api/trails', TRAILSROUTER)
app.use('/api/comments', COMMENTSROUTER)
app.use('/api/ratings', RATINGSROUTER)
app.use('/api/pending', PENDINGROUTER)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
let response
   if (NODE_ENV === 'production') {
     response = { error: { message: 'server error' } }
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
})

module.exports = app