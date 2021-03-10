const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
    let db

    const {
        testUsers, 
        testTrails, 
        testLocations, 
        testComments, 
        testRatings, 
        testPending
    } = helpers.makeTrailsFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnet from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

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

    const protectedEndpoints = [
        {
            name: 'GET /api/trails',
            path: '/api/trails',
            method: supertest(app).get,
        },
        {
            name: 'GET /api/trails/:trail_id',
            path: '/api/trails/1',
            method: supertest(app).get,
        },
        {
            name: 'GET /api/trails/:trail_id/comments',
            path: '/api/trails/1/comments',
            method: supertest(app).get,
        },
        {
            name: 'GET /api/trails/:trail_id/ratings',
            path: '/api/trails/1/ratings',
            method: supertest(app).get,
        },
        {
            name: 'POST /api/comments/:trail_id',
            path: '/api/comments/1',
            method: supertest(app).post,
        },
        {
            name: 'POST /api/ratings/:trail_id',
            path: '/api/comments/1',
            method: supertest(app).post,
        }
    ]

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, {error: `Missing bearer token`})
            })

            it(`responds 401 'Unauthorised request'when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: `Unauthorised request`})
            })

            it(`responds 401 'Unauthorised request' when invalid sub in payload`, () => {
                const invalidUser = { username: 'nonexistent', id: 1 }
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, { error: `Unauthorised request` })
            })
        })
    })
})