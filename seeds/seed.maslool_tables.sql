BEGIN;

TRUNCATE
    trails,
    pending,
    users,
    comments,
    ratings
    RESTART IDENTITY CASCADE;

INSERT INTO users (id, username, password, email, admin, banned, banned_by)
VALUES
    (  
        1,
        'spongebob',
        -- password: squarepants
        '$2a$12$gXYefyhXqRU5Cd0fV/dB3ulvaZmXEUZW7HMcF4ELhhUnGes64vft.',
        'sb.squarepants@bikinibottom.net',
        false,
        false,
        NULL
    ),
    (
        2,
        'patrick',
        -- password: star
        '$2a$12$VBE1W4TbGF3pDw7806hRQOBA1zDhS9e4lMAWGw1xd6Rd7fjJPgRcC',
        'p.star@bikinibottom.net',
        false,
        true,
        'sandy'
    ),
    (
        3,
        'sandy',
        -- password: texas
        '$2a$12$6tHzkU.P/ndfd8QgcbV7iutf2fJwgdcUGbBFuVg06tIhdHrUrNDWe',
        'sandy.cheeks@squirrelmail.com',
        true,
        false,
        NULL
    ),
    (
        4,
        'eugene',
        -- password: money
        '$2a$12$1mApGq0vfeQC8to6WhPaGeqH6g8wLWBYpkqifHKaPSUVaFB5unOCG',
        'eugene.krabs@krustykrab.com',
        false,
        false,
        NULL
    ),
    (
        5,
        'liron',
        -- password: AdminAdmin1!
        '$2a$12$dxjXi89H7AObnxh9K4AiDeHyN2bJH6I8wtdKm2HlXh7osTZY.Ltqi',
        'liron.dco@gmail.com',
        true,
        false,
        NULL
    ),
    (
        6,
        'squidward',
        -- password: tentacles
        '$2a$12$dJEy0lZ8iXbO.y3LQLT.peLNIaA95on1BiyEPZFroS/UPkEarxO3e',
        's.tentacles@krustykrab.com',
        false,
        false,
        NULL
    );

INSERT INTO trails (id, name, difficulty, website, description, safety)
VALUES
    (
        1,
        'Tecolote Canyon Trail',
        'begginer',
        'https://www.sandiego.gov/park-and-recreation/parks/osp/tecolote',
        'Tecolote Canyon Natural Park & Nature Center offers its visitors a variety of educational and recreational opportunities. The Canyon has approximately 6.5 miles of trails that can be used for jogging walking and mountain biking. Also available to visitors is the Tecolote Nature Center which offers a host of exhibits on the animal and plant life of the Canyon. The Nature Center is also available for meetings, workshops, classes and special events. Please contact the Center Director at 858-581-9959 for more information.',
        'Tecolote Canyon, like many other places in California, is a fire risk.'
    ),
    (
        2,
        'Cleveland National Forest',
        'intermediate',
        'https://www.fs.usda.gov/cleveland',
        'The Cleveland National Forest has many great hiking trails, good for all levels of physical activity and hiking experience. It is recommended that you assess your physical fitness level before beginning any new hike or contact the local ranger station for any questions on hike suitability.',
        'The Cleveland National Forest, like many other places in California, is a fire risk. Please consult their website for updated fire warnings.'
    ),
    (
        3,
        'Joshua Tree National Park',
        'intermediate',
        'https://www.nps.gov/jotr/index.htm',
        'Joshua Tree National Park is open year-round. There are few facilities within the park''s approximately 800,000 acres, making Joshua Tree a true desert wilderness just a few hours outside Los Angeles, San Diego, Las Vegas, and Phoenix. About 2.8 million visitors come to the park each year to enjoy activities such as hiking, camping, photography, rock climbing, and simply enjoying the serene desert scenery. The busy season in Joshua Tree runs from October through May.',
        'Joshua Tree is located in an arid desert. Heatwaves are common during the summer and flash floods during rainy weather. In the winter, temperatures can go below freezing. Plan accordingly.'
    )
    (
        4,
        'Coconino National Forest',
        'beginner',
        'https://www.fs.usda.gov/coconino',
        'The Coconino National Forest is one of the most diverse National Forests in the country with landscapes ranging from the famous red rocks of Sedona to Ponderosa pine forests, from southwestern desert to alpine tundra. Explore mountains and canyons, fish in small lakes, and wade in lazy creeks and streams.',
        'Coconino National Forest is a fire risk area and campfire restrictions are enforced periodically.'
    ),
    (
        5,
        'Grizzly Creek at the White River National Forest',
        'advanced',
        'https://www.fs.usda.gov/recarea/whiteriver/recreation/hiking/recarea/?recid=41223&actid=50',
        'The Grizzly Creek trail begins in Glenwood Canyon and ends 3.5 miles above. The trail travels up from the Colorado River through the canyon cut by Grizzly Creek, following the creek most of the time.The first 1/2 mile of the trail is broad and fairly level offering good spots to have a picnic near the creek. The trail will become narrower and surrounded by dense, lush vegetation, some areas are very rocky at times.The last 1 1/2 miles are steep and covered with loose rocks with good views of Grizzly Creek and Glenwood Canyon near the top.',
        'White River National Forest is a fire risk area. Check for fire closures while planning your trip and observe fire safety measures while in the area.'
    ),
    (
        6,
        'Audra State Park',
        'beginner',
        'https://wvstateparks.com/park/audra-state-park/',
        'Audra State Park is a heavily wooded area bisected by the Middle Fork River located in southwestern Barbour County and a portion of Upshur County. Each year, visitors are drawn to the natural beauty of the Middle Fork and its surroundings, which offers opportunities for hiking, camping and family picnics. This park is an ideal destination for families who enjoy the outdoors. The clear, clean water of the Middle Fork River and the rock overhang of the Alum Cave offer picture-perfect backdrops.',
        NULL
    ),
    (
        7,
        'Asan Ridge Trail',
        'intermediate',
        'https://www.nps.gov/wapa/learn/nature/asanridgetrail.htm',
        'War in the Pacific National Historical Park burgeons with life. Scars and stains of World War II still remain on many Pacific islands, but over time, vibrant plant and animal communities have dramatically rebounded. Within the park's boundaries lie coral reefs, seagrass beds, tropical savanna grasslands, limestone forests, bogs, streams, coastal and forest wetlands, offshore islets, and even a mahogany forest! These outstanding environments create homes for rare animals and provide a laboratory for scientific inquiry and research. Take a look through these pages to become acquainted with Guam's outdoor wonders - and learn more about the NPS Inventory and Monitoring Program that keeps tabs on many of the plants, animals, and weather throughout Pacific island national parks.',
        'The National Park is located in a typhoon zone. A special liability insurance is also required before you are allowed entry into the park.'
    );
    
INSERT INTO locations (trail_id, address_line, city, region, postal_code)
VALUES
    (
        1,
        '5180 Tecolote Rd',
        'San Diego',
        'California',
        '92110'
    ),
    (
        2,
        'Co Hwy S7',
        'Santa Ysabel',
        'California',
        '92070'
    ),
    (
        3,
        '74485 National Park Drive',
        'Twentynine Palms',
        'California',
        '92277'
    ),
    (
        4,
        '5075 US-89',
        'Flagstaff',
        'Arizona',
        '86004'
    ),
    (
        5,
        '57051-57105 I-70',
        'Glenwood Springs',
        'Colorado',
        '81601'
    ),
    (
        6,
        '8397 Audra Park Rd',
        'Buckhannon',
        'West Virginia',
        '26201'
    ),
    (
        7,
        '135 Murray Blvd',
        'Hagatna',
        'Guam',
        '96910'
    );

    
INSERT INTO pending (message, submitted_by_id)
VALUES
    (
        'Please add the South Fork Eagle River trail in Alaska! It''s a very extensive trail in such a beautiful natural scenery. Here''s more information about it: https://www.alaska.org/detail/south-fork-eagle-river-trail',
        6
    ),
    (
        'HAHAHAHA LOL this is so funny',
        1
    );

    
INSERT INTO comments (user_id, trail_id, content, flagged, flagged_by)
VALUES
    (
        4,
        3,
        'This is such a beautiful place!',
        false,
        NULL
    ),
    (
        1,
        3,
        'Mister Krabs is lying do not believe him he has not paid me my last salary!!!',
        true,
        4
    ),
    (
        3,
        5,
        'Lovely place with superb views and challenging trails! I cannot believe I am saying this but it is better than Texas.',
        false,
        NULL
    ),
    (
        6,
        4,
        'I really enjoy the seclusion of some of the spots here. I can play my clarinet in peace without anyone throwing stuff at me.',
        false,
        NULL
    ),
    (
        2,
        1,
        'I guess it was okay?',
        false,
        NULL
    ),
    (
        1,
        7,
        'I love how close it is to home!',
        false,
        NULL
    ),
    (
        4,
        2,
        'Beatiful forest! Everyone should visit!',
        false,
        NULL
    );

INSERT INTO ratings (user_id, trail_id, rating)
VALUES
    (
        1,
        7,
        4
    ),
    (
        2,
        6,
        5
    ),
    (
        3,
        5,
        3
    ),
    (
        4,
        4,
        2
    ),
    (
        5,
        3,
        1
    ),
    (
        6,
        2,
        5
    ),
    (
        1,
        1,
        3
    ),
    (
        2,
        1,
        4
    ),
    (
        3,
        1,
        5
    ),
    (
        4,
        1,
        2
    ),
    (
        5,
        1,
        4
    ),
    (
        6,
        1,
        1
    );

CREATE SEQUENCE user_id_seq;
CREATE SEQUENCE trail_id_seq;
SELECT setval('user_id_seq', (SELECT MAX(id) from "users"));
SELECT setval('trail_id_seq', (SELECT MAX(id) from "trails"));

COMMIT;