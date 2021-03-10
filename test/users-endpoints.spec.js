const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Users Endpoints', function() {
    let db

    const { testUsers } = helpers.makeTrailsFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
         db = knex({
             client: 'pg',
             connection: process.env.TEST_DATABASE_URL,
         })
         app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () => 
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            const requiredFields = ['username', 'password', 'email']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    username: 'test username',
                    password: 'test password',
                    email: 'test@email.net'
                }

                it(`responds with 400 required error when ${field} is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing ${field} in request body`
                    })
                })
            })

            it(`responds 400 'Password must be longer than 8 characters' when short password`, () => {
                const userShortPassword = {
                    username: 'test username',
                    password: '1234567',
                    email: 'test@email.net'
                }

                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, { error: 'Password must be longer than 8 characters' })
            })

            it(`responds with 400 'Password must be less than 72 characters when too long`, () => {
                const userLongPassword = {
                    username: 'test username',
                    password: '*'.repeat(73),
                    email: 'test@email.next'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be shorter than 72 characters` })
            })

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                  username: 'test username',
                  password: ' 1Aa!2Bb@',
                  email: 'test@email.net',
                }
                return supertest(app)
                  .post('/api/users')
                  .send(userPasswordStartsSpaces)
                  .expect(400, { error: `Password must not start or end with empty spaces` })
              })

              it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                  username: 'test username',
                  password: '1Aa!2Bb@ ',
                  email: 'test@email.net',
                }
                return supertest(app)
                  .post('/api/users')
                  .send(userPasswordEndsSpaces)
                  .expect(400, { error: `Password must not start or end with empty spaces` })
              })

              it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                  username: 'test username',
                  password: '1Aa!2Bb@ ',
                  email: 'test@email.net',
                }
                return supertest(app)
                  .post('/api/users')
                  .send(userPasswordEndsSpaces)
                  .expect(400, { error: `Password must not start or end with empty spaces` })
              })

              it(`responds 400 'Username already taken' when username isn't unique`, () => {
                const duplicateUser = {
                  username: testUser.username,
                  password: '11AAaa!!',
                  email: 'test@email.net',
                }
                return supertest(app)
                  .post('/api/users')
                  .send(duplicateUser)
                  .expect(400, { error: `Username already taken` })
            })
        })

    })
})