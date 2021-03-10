  
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'test-user-1',
            password: 'password',
            email: 'testuser1@email.com',
            join_date: new Date('2029-01-22T16:28:32.615Z'),
            admin: false,
            banned: false,
            banned_by: null,
        },
        {
            id: 2,
            username: 'test-admin',
            password: 'password',
            email: 'testadmin@email.com',
            join_date: new Date('2029-01-22T16:28:32.615Z'),
            admin: true,
            banned: false,
            banned_by: null,
        },
        {
            id: 3,
            username: 'test-banned',
            password: 'password',
            email: 'banned@email.com',
            join_date: new Date('2029-01-22T16:28:32.615Z'),
            admin: false,
            banned: true,
            banned_by: 'test-admin'
        },
        {
            id: 4,
            username: 'test-user-2',
            password: 'password',
            email: 'testuser2@email.com',
            join_date: new Date('2029-01-22T16:28:32.615Z'),
            admin: false,
            banned: false,
            banned_by: null
        }
    ]
}

function makeTrailsArray() {
    return [
        {
            id: 1,
            name: 'Test Trail 1',
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            website: 'www.trail1.net',
            description: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle. Direct trade vaporware jean shorts listicle lomo food truck lumbersexual intelligentsia copper mug taxidermy cold-pressed prism single-origin coffee kombucha roof party.            ',
            safety: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle.',
            difficulty: 'Intermediate',
            rating: 0
        },
        {
            id: 2,
            name: 'Test Trail 2',
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            website: 'www.trail2.net',
            description: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle. Direct trade vaporware jean shorts listicle lomo food truck lumbersexual intelligentsia copper mug taxidermy cold-pressed prism single-origin coffee kombucha roof party.            ',
            safety: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle.',
            difficulty: 'Beginner',
            rating: 0
        },
        {
            id: 1,
            name: 'Test Trail 3',
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            website: 'www.trail3.net',
            description: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle. Direct trade vaporware jean shorts listicle lomo food truck lumbersexual intelligentsia copper mug taxidermy cold-pressed prism single-origin coffee kombucha roof party.            ',
            safety: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle.',
            difficulty: 'Advanced',
            rating: 0
        },
        {
            id: 4,
            name: 'Test Trail 4',
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            website: 'www.trail4.net',
            description: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle. Direct trade vaporware jean shorts listicle lomo food truck lumbersexual intelligentsia copper mug taxidermy cold-pressed prism single-origin coffee kombucha roof party.            ',
            safety: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle.',
            difficulty: 'Intermediate',
            rating: 0
        },
        {
            id: 5,
            name: 'Test Trail 5',
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            website: 'www.trail5.net',
            description: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle. Direct trade vaporware jean shorts listicle lomo food truck lumbersexual intelligentsia copper mug taxidermy cold-pressed prism single-origin coffee kombucha roof party.            ',
            safety: 'Truffaut franzen fam lomo. Ennui before they sold out franzen hella. Truffaut chartreuse quinoa kickstarter. Offal ramps neutra, seitan green juice meh four loko raclette stumptown blue bottle.',
            difficulty: 'Beginner',
            rating: 0
        }
    ]
}

function makeLocationsArray(trails) {
    return [
        {
            id: 1,
            trail_id: trails[0].id,
            address_line: '9 Livingston Lane',
            city: 'Oxnard',
            region: 'California',
            postal_code: '93035'
        },
        {
            id: 2,
            trail_id: trails[1].id,
            address_line: '9 Tallwood Drive',
            city: 'Savannah',
            region: 'Georgia',
            postal_code: '31404',
        },
        {
            id: 3,
            trail_id: trails[2].id,
            address_line: '651 Trout St.',
            city: 'Stevens Point',
            region: 'Wisconsin',
            postal_code: '54481'
        },
        {
            id: 4,
            trail_id: trails[3].id,
            address_line: '7680 Oak Meadow Dr',
            city: 'Mount Prospect',
            region: 'Illinois',
            postal_code: '60056'
        },
        {
            id: 5,
            trail_id: trails[4].id,
            address_line: '8434 Logan St.',
            city: 'Mechanicsburg',
            region: 'Pennyslvania',
            postal_code: '17050'
        }
    ]
}

function makeCommentsArray(users, trails) {
    return [
        {
            id: 1,
            trail_id: trails[0].id,
            user_id: users[0].id,
            content: 'First test comment!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: false,
            flagged_by: null,
        },
        {
            id: 2,
            trail_id: trails[0].id,
            user_id: users[1].id,
            content: 'Second test comment flagged!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: true,
            flagged_by: users[0].id,
        },
        {
            id: 3,
            trail_id: trails[1].id,
            user_id: users[1].id,
            content: 'Third test comment!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: false,
            flagged_by: null,
        },
        {
            id: 3,
            trail_id: trails[2].id,
            user_id: users[2].id,
            content: 'Third test comment!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: false,
            flagged_by: null,
        },
        {
            id: 4,
            trail_id: trails[2].id,
            user_id: users[3].id,
            content: 'Fourth test comment flagged!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: true,
            flagged_by: users[0].id,
        },
        {
            id: 5,
            trail_id: trails[2].id,
            user_id: users[0].id,
            content: 'Fifth test comment!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: false,
            flagged_by: null,
        },
        {
            id: 6,
            trail_id: trails[3].id,
            user_id: users[0].id,
            content: 'Six test comment!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: false,
            flagged_by: null,
        },
        {
            id: 7,
            trail_id: trails[4].id,
            user_id: users[3].id,
            content: 'Seventh test comment!',
            last_modified: new Date('2029-01-22T16:28:32.615Z'),
            flagged: false,
            flagged_by: null,
        },
    ]
}

function makeRatingsArray(users, trails) {
    [
        {
            id: 1,
            trail_id: trails[0].id,
            user_id: users[0].id,
            rating: 5,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2,
            trail_id: trails[0].id,
            user_id: users[1].id,
            rating: 3,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 3,
            trail_id: trails[1].id,
            user_id: users[2].id,
            rating: 2,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 4,
            trail_id: trails[1].id,
            user_id: users[4].id,
            rating: 5,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 5,
            trail_id: trails[1].id,
            user_id: users[0].id,
            rating: 4,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 6,
            trail_id: trails[2].id,
            user_id: users[1].id,
            rating: 1,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 7,
            trail_id: trails[3].id,
            user_id: users[0].id,
            rating: 3,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 8,
            trail_id: trails[3].id,
            user_id: users[1].id,
            rating: 4,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 9,
            trail_id: trails[4].id,
            user_id: users[1].id,
            rating: 1,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        }, {
            id: 10,
            trail_id: trails[4].id,
            user_id: users[0].id,
            rating: 4,
            date_modified: new Date('2029-01-22T16:28:32.615Z'),
        },
    ]
}

function makePendingArray(users) {
    [
        {
            id: 1,
            message: 'Neutra taxidermy VHS, vape stumptown lumbersexual af biodiesel raw denim cloud bread cronut mumblecore. Kitsch hoodie pug, deep v pickled drinking vinegar dreamcatcher brunch bitters. Meh letterpress trust fund tilde biodiesel offal man braid plaid chicharrones fashion axe kickstarter subway tile adaptogen kinfolk.',
            submitted_by_id: users[0].id
        },
        {
            id: 2,
            message: 'Neutra taxidermy VHS, vape stumptown lumbersexual af biodiesel raw denim cloud bread cronut mumblecore. Kitsch hoodie pug, deep v pickled drinking vinegar dreamcatcher brunch bitters. Meh letterpress trust fund tilde biodiesel offal man braid plaid chicharrones fashion axe kickstarter subway tile adaptogen kinfolk.',
            submitted_by_id: users[1].id
        },
        {
            id: 3,
            message: 'Neutra taxidermy VHS, vape stumptown lumbersexual af biodiesel raw denim cloud bread cronut mumblecore. Kitsch hoodie pug, deep v pickled drinking vinegar dreamcatcher brunch bitters. Meh letterpress trust fund tilde biodiesel offal man braid plaid chicharrones fashion axe kickstarter subway tile adaptogen kinfolk.',
            submitted_by_id: users[2].id
        },
        {
            id: 4,
            message: 'Neutra taxidermy VHS, vape stumptown lumbersexual af biodiesel raw denim cloud bread cronut mumblecore. Kitsch hoodie pug, deep v pickled drinking vinegar dreamcatcher brunch bitters. Meh letterpress trust fund tilde biodiesel offal man braid plaid chicharrones fashion axe kickstarter subway tile adaptogen kinfolk.',
            submitted_by_id: users[3].id
        },
    ]
}

function makeExpectedTrail(trail, locations, comments = [], ratings = []) {
    const location = locations
        .find(loc => loc.trail_id === trail.id)

    const number_of_comments = comments
        .filter(comment => comment.trail_id === trail.id)
        .length

    const number_of_ratings = ratings
        .filter(rtg => rtg.trail_id === trail.id)
        .length

    let rating_array = ratings.filter(rtg => rtg.trail_id === trail.id)
    let rating_sum = 0;

    for (let i = 0; i < number_of_ratings; i++) {
        rating_sum += rating_array[i].rating
    }

    return {
        id: trail.id,
        name: trail.name,
        date_published: trail.date_published,
        website: trail.website,
        description: trail.description,
        safety: trail.safety,
        rating: rating_sum / number_of_ratings,
        difficulty: trail.difficulty,
        number_of_comments,
        number_of_ratings,
        location: {
            id: location.id,
            address_line: location.address_line,
            city: location.city,
            region: location.region,
            postal_code: location.postal_code
        }
    }
}

function makeExpectedTrailComments(users, trailId, comments) {
    const expectedComments = comments
        .filter(comment => comment.trail_id === trailId)

    return expectedComments.map(comment => {
        const commentUser = users.find(user => user.id === comment.user_id)
        return {
            id: comment.id,
            content: comment.content,
            trail_id: comment.trail_id,
            last_modified: comment.last_modified,
            flagged: comment.flagged,
            flagged_by: comment.flagged_by,
            user: {
                id: commentUser.id,
                username: commentUser.username,
                join_date: commentUser.join_date,
                admin: commentUser.admin,
                banned: commentUser.banned,
                banned_by: commentUser.banned_by
            },
        }
    })
}

function makeExpectedTrailRatings(users, trailId, ratings) {
    const expectedRatings = ratings
        .filter(rtg => rtg.trail_id === trailId)

    return expectedRatings.map(rating => {
        const ratingUser = users.find(user => user.id === rating.user_id)
        return {
            id: rating.id,
            rating: rating.rating,
            trail_id: rating.trail_id,
            date_modified: rating.date_modified,
            user: {
                id: ratingUser.id,
                username: ratingUser.username,
                join_date: ratingUser.join_date,
                admin: ratingUser.admin,
                banned: ratingUser.banned,
                banned_by: ratingUser.banned_by
            },
        }
    })
}

function makeMaliciousTrail() {
    const maliciousTrail = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        date_published: new Date(),
        website: 'www.bad.net',
        description:`Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        safety: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        difficulty: 'Beginner',
        rating: 0
    }
    const expectedTrail = {
        ...makeExpectedTrail(trail),
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        description:`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        safety: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }

    return {
        maliciousTrail,
        expectedTrail
    }
}

function makeTrailsFixtures() {
    const testUsers = makeUsersArray(),
    const testTrails = makeTrailsArray(),
    const testLocations = makeLocationsArray(testTrails),
    const testComments = makeCommentsArray(testUsers, testTrails)
    const testRatings = makeRatingsArray(testUsers, testTrails)
    const testPending = makePendingArray(testUsers)
    return { testUsers, testTrails, testLocations, testComments, testRatings, testPending}
}

function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                trails,
                locations,
                users,
                comments,
                ratings,
                pending
            `
        )
        .then(() =>
            Promise.all([
                trx.raw(`ALTER SEQUENCE trails_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE ratings_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE locations_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE pending_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('trails_id_seq', 0)`),
                trx.raw(`SELECT setval('users_id_seq', 0)`),
                trx.raw(`SELECT setval('comments_id_seq', 0)`),   
                trx.raw(`SELECT setval('ratings_id_seq', 0)`),
                trx.raw(`SELECT setval('locations_id_seq', 0)`),
                trx.raw(`SELECT setval('pending_id_seq', 0)`),
            ])
        )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(() => 
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id]
            )
        )
}

function seedTrailsTables(db, users, trails, locations, comments=[], ratings=[]) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('trails').insert(trails)
        await trx.into('locations').insert(locations)
        await Promise.all([
            trx.raw(
                `SELECT setval('trails_id_seq', ?)`,
                [trails[trails.length - 1].id],
            ),
            trx.raw(
                `SELECT setval('locations_id_seq', ?)`,
                [locations[locations.length - 1].id],
            ),
        ])
        if (comments.length) {
            await trx.into('comments').insert(comments)
            await trx.raw(
                `SELECT setval('comments_id_seq', ?)`,
                [comments[comments.length - 1].id],
            )
        }
        if (ratings.length) {
            await trx.into('ratings').insert(ratings)
            await trx.raw(
                `SELECT setval('ratings_id_seq', ?)`,
                [ratings[ratings.length - 1].id],
            )
        }
    })
}

function seedMaliciousTrail(db, trail) {
    return db
        .into('trails')
        .insert([trail])
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.username,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }
  

module.exports = {
    makeUsersArray,
    makeTrailsArray,
    makeLocationsArray,
    makeCommentsArray,
    makeRatingsArray,
    makePendingArray,
    makeExpectedTrail,
    makeExpectedTrailComments,
    makeExpectedTrailRatings,
    makeMaliciousTrail,
    makeTrailsFixtures,
    cleanTables,
    seedTrailsTables,
    seedMaliciousTrail,
    makeAuthHeader,
    seedUsers,
}