const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Pending Endpoints', function () {
    let db

    const {
        testUsers,
        testPending
    } = helpers.makeTrailsFixtures()

    const testUser = testUsers[0]
    const testAdmin = testUsers[1]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/pending`, () => {
        context(`Given there are items in pending`, () => {
            beforeEach(() => {
                helpers.seedUsers(db, testUsers)
                    .then(() => helpers.seedPending(db, testPending))
            })
            it(`responds with 401 if user is not admin`, () => {
                return supertest(app)
                    .get('/api/pending')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(401)
            })

            it(`responds with 200 if the user is an admin`, () => {
                return supertest(app)
                    .get('/api/pending')
                    .set('Authorization', helpers.makeAuthHeader(testAdmin))
                    .expect(200)
            })
        })
    })

    describe(`POST /api/pending`, () => {
        beforeEach(() => {
            helpers.seedUsers(db, testUsers)
        })
        it(`creates a new pending message and returns 201`, () => {
            this.retries(3)
            const newPending = {
                message: 'Hello world'
            }
            return supertest(app)
                .post('/api/pending')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newPending)
                .expect(201)
        })

        it('responds with 400 and an error message when there is no message', () => {
            this.retries(3)
            return supertest(app)
                .post('/api/pending')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send('')
                .expect(400, {
                    error: 'Missing message in request body'
                })
        })
    })

})