const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
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

    describe(`POST /api/comments/:trail_id`, () => {
        beforeEach('insert articles', () => 
            helpers.seedTrailsTables(
                db,
                testUsers,
                testTrails,
                testLocations,
                testComments[0],
                testRatings
            )
        )

        it(`creates an comment, responding with 201 and the new comment`, function() {
            this.retries(3)
            const testTrail = testTrails[0]
            const trailId = testTrail.id
            const testUser = testUsers[0]
            const newComment = {
                content: 'Test new comment'
            }
            return supertest(app)
                .post(`/api/comments/${trailId}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newComment)
                .expect(201)
        })

        it(`responds with 400 and an error message when there's no content`, () => {
            this.retries(3)
            const testTrail = testTrails[0]
            const trailId = testTrail.id
            const testUser = testUsers[0]
            return supertest(app)
                .post(`/api/comments/${trailId}`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send('')
                .expect(400, {
                    error: 'Missing content in request body'
                })
        })
    })
})