BEGIN;

TRUNCATE
    trails,
    pending,
    users,
    comments,
    ratings
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, email, admin, banned, banned_by)
VALUES
    (
        'spongebob',
        -- password: squarepants
        '$2a$12$gXYefyhXqRU5Cd0fV/dB3ulvaZmXEUZW7HMcF4ELhhUnGes64vft.',
        'sb.squarepants@bikinibottom.net',
        false,
        false,
        NULL
    ),
    (
        'patrick',
        -- password: star
        '$2a$12$VBE1W4TbGF3pDw7806hRQOBA1zDhS9e4lMAWGw1xd6Rd7fjJPgRcC',
        'p.star@bikinibottom.net',
        false,
        true,
        'sandy'
    ),
    (
        'sandy',
        -- password: texas
        '$2a$12$6tHzkU.P/ndfd8QgcbV7iutf2fJwgdcUGbBFuVg06tIhdHrUrNDWe',
        'sandy.cheeks@squirrelmail.com',
        true,
        false,
        NULL
    ),
    (
        'eugene',
        -- password: money
        '$2a$12$1mApGq0vfeQC8to6WhPaGeqH6g8wLWBYpkqifHKaPSUVaFB5unOCG',
        'eugene.krabs@krustykrab.com',
        false,
        false,
        NULL
    ),
    (
        'liron',
        -- password: AdminAdmin1!
        '$2a$12$dxjXi89H7AObnxh9K4AiDeHyN2bJH6I8wtdKm2HlXh7osTZY.Ltqi',
        'liron.dco@gmail.com',
        true,
        false,
        NULL
    ),
    (
        'squidward',
        -- password: tentacles
        '$2a$12$dJEy0lZ8iXbO.y3LQLT.peLNIaA95on1BiyEPZFroS/UPkEarxO3e',
        's.tentacles@krustykrab.com',
        false,
        false,
        NULL
    )