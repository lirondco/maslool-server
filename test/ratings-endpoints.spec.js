const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Ratings Endpoints', function() {
    let db

    const {
        testTrails,
        testUsers,
        testLocations,
        testComments,
        testRatings
    } = helpers.makeTrailsFixtures()

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

    describe(`POST /api/ratings/:trail_id`, () => {
        beforeEach('insert trails', () => 
            helpers.seedTrailsTables(
                db,
                testUsers,
                testTrails,
                testLocations,
                testComments,
                testRatings
            )
        )

        const testTrail = testTrails[0]
        const trailId = testTrail.id
        const testRepeatUser = testUsers[0]
        const testNewUser = testUsers[3]
        const newRating = {
            rating: 4
        }

        it(`user rates again, responding with 400 and an error message`, function() {
            this.retries(3)

            return supertest(app)
                .post(`/api/ratings/${trailId}`)
                .set('Authorization', helpers.makeAuthHeader(testRepeatUser))
                .send(newRating)
                .expect(400, { error: 'User can only rate once' })
        })

        it(`new user rates, responding with 201`, function() {
            this.retries(3)

            return supertest(app)
                .post(`/api/ratings/${trailId}`)
                .set('Authorization', helpers.makeAuthHeader(testNewUser))
                .send(newRating)
                .expect(201)
        })

        it(`responds with 400 and an error message when there's no rating`, () => {
            this.retries(3)

            return supertest(app)
                .post(`/api/ratings/${trailId}`)
                .set('Authorization', helpers.makeAuthHeader(testNewUser))
                .send('')
                .expect(400, {
                    error: 'Missing content in request body'
                })
        })
    })
})