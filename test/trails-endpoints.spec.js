const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Trails Endpoints', function () {
    let db

    const {
        testLocations,
        testUsers,
        testTrails,
        testComments,
        testRatings
    } = helpers.makeTrailsFixtures()

    const testUser = testUsers[0]
    const testBannedUser = testUsers[2]
    const testAdmin = testUsers[1]

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

    describe(`GET /api/trails`, () => {
        context(`Given that user is not logged in`, () => {
            it(`responds with 401 and 'Missing bearer token'`, () => {
                return supertest(app)
                    .get('/api/trails')
                    .expect(401, { error: `Missing bearer token` })
            })
        })
        context(`Given that user is logged in and the there is no trail in the database`, () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/trails')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, { error: 'Sorry, we do not have any trail matching that criteria. We are currently expanding our database and if you have any good suggestion, please do not hesitate to contact an admin.' })
            })
        })

        context('Given there are trails in the database', () => {
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

            it('responds with 200 and all of the trails', () => {
                const expectedTrails = testTrails.map(trail =>
                    helpers.makeExpectedTrail(
                        trail,
                        testLocations,
                        testComments,
                        testRatings
                    )
                )
                return supertest(app)
                    .get('/api/trails')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedTrails)
            })

            it('responds with 401 and user is banned when user is banned', () => {
                return supertest(app)
                    .get('/api/trails')
                    .set('Authorization', helpers.makeAuthHeader(testBannedUser))
                    .expect(401, { error: 'User is banned' })
            })
        })

        context(`Given someone posts a new trail in the database`, () => {
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

            it('responds with 401 unauthorised if the user is not an admin', () => {
                return supertest(app)
                    .post('/api/trails')
                    .send({ ...testTrails[0], location: { ...testLocations[0] } })
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(401, { error: 'Unauthorised request' })
            })

            it('responds with 401 unauthorised if the user is banned', () => {
                return supertest(app)
                    .post('/api/trails')
                    .send({ ...testTrails[0], location: { ...testLocations[0] } })
                    .set('Authorization', helpers.makeAuthHeader(testBannedUser))
                    .expect(401, { error: 'Unauthorised request' })
            })

            it('responds with 201 if the user is an admin', () => {
                return supertest(app)
                    .post('/api/trails')
                    .send({ ...testTrails[0], location: { ...testLocations[0] } })
                    .set('Authorization', helpers.makeAuthHeader(testAdmin))
                    .expect(201)
            })
        })

        context(`Given an XSS attack trail`, () => {
            const {
                maliciousTrail,
                expectedTrail
            } = helpers.makeMaliciousTrail()

            beforeEach('insert malicious trail', () => {
                return helpers.seedMaliciousTrail(
                    db,
                    testUser,
                    maliciousTrail
                )
            })

            it('removes XXS attack content', () => {
                return supertest(app)
                    .get(`/api/trails`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedTrail.name)
                        expect(res.body[0].description).to.eql(expectedTrail.description)
                        expect(res.body[0].safety).to.eql(expectedTrail.safety)
                    })
            })
        })
    })

    describe(`GET /api/trails/:trail_id`, () => {
        context(`Given no trails`, () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 404`, () => {
                const trailId = 123
                return supertest(app)
                    .get(`/api/trails/${trailId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, { error: `Trail doesn't exist` })
            })
        })

        context('Given there are trails in the database', () => {
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

            it('responds with 200 and the specified trail', () => {
                const trailId = 2
                const expectedTrail = helpers.makeExpectedTrail(
                    testTrails[trailId - 1],
                    testLocations,
                    testComments,
                    testRatings,
                )

                return supertest(app)
                    .get(`/api/trails/${trailId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedTrail)
            })
        })
    })

    describe(`GET /api/trails/:trail_id/comments`, () => {
        context('Given no trails', () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 404`, () => {
                const trailId = 5678
                return supertest(app)
                    .get(`/api/trails/${trailId}/comments`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, { error: `Trail doesn't exist` })
            })
        })

        context('Given there are comments for trail in the database', () => {
            beforeEach('insert trail', () => 
                helpers.seedTrailsTables(
                    db,
                    testUsers,
                    testTrails,
                    testLocations,
                    testComments,
                    testRatings
                )
            )

            it('responds with 200 and the specified comments', () => {
                const trailId = 1
                const expectedComments = helpers.makeExpectedTrailComments(
                    testUsers,
                    1,
                    testComments
                )

                return supertest(app)
                    .get(`/api/trails/${trailId}/comments`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedComments)
            })
        })
    })

    describe(`GET /api/trails/:trail_id/ratings`, () => {
        context('Given no trails', () => {
            beforeEach(() =>
                helpers.seedUsers(db, testUsers)
            )

            it(`responds with 404`, () => {
                const trailId = 5678
                return supertest(app)
                    .get(`/api/trails/${trailId}/ratings`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, { error: `Trail doesn't exist` })
            })
        })

        context('Given there are ratings for trail in the database', () => {
            beforeEach('insert trail', () => 
                helpers.seedTrailsTables(
                    db,
                    testUsers,
                    testTrails,
                    testLocations,
                    testComments,
                    testRatings
                )
            )

            it('responds with 200 and the specified ratings', () => {
                const trailId = 1
                const expectedRatings = helpers.makeExpectedTrailRatings(
                    testUsers,
                    trailId,
                    testRatings
                )

                return supertest(app)
                    .get(`/api/trails/${trailId}/ratings`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedRatings)
            })
        })
    })
})