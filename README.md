# Maslool App Server &#x202b; שרת של האתר ״מסלול״ <br />
BaseURL: https://still-journey-41951.herokuapp.com/api 

## API Documentation &#x202b; תיעוד השרת <br />
### BaseURL/users

#### '/'
GET - requires admin privileges / returns all users
    - if the user is neither logged in nor an admin, it will return a 401 unauthorised error. 
    - if the user is an admin, it will return a list of all users.

POST - registers new user
     - required: { username, password, email }
     - Password must contain at least one upper case, lower case, number, and special characters, be more than 8 characters and less than 72 characters long, and have no spaces at the beginning or at the end.
     - Email needs to be in a valid email format.

#### '/:user_id'
GET - returns user's information
    - if the user is neither the user being requested nor an admin, it will return a 401 unauthorised error.

PATCH - updates user's information
      - required: one of { username, password, email }
      - Password must contain at least one upper case, lower case, number, and special characters, be more than 8 characters and less than 72 characters long, and have no spaces at the beginning or at the end.
      - Email needs to be in a valid email format.

#### '/ban/:user_id'
PATCH - bans or unbans a user, requires admin privileges
      - udpates user.banned to either "true" or "fales" and user.banned_by to the name of the admin or "null".

#### '/setadmin/:user_id'
PATCH - enables or revokes a selected user's admin privileges. 
      - can only be done by the site owner.

### BASEURL/auth
#### '/login'
POST - gets the user an authorisation token if the username and password are correct.
     - gives a 401 unauthorised error if the user is banned.

#### '/refresh'
POST - gives the user a new authorisation token when they're logged in.

#### BASEURL/trails - Authorisation required
#### '/'
GET - returns all trails

POST - admin privileges required
     - requires { name, website, description, difficulty (one of Beginner, Intermediate, Advanced), location }
     - { location } requires { address_line, city, region, postal_code }
     - optional { safety }, defaults to null if left empty.

#### '/:trail_id' 
GET - returns selected trail. If trail_id doesn't match that of any existing trail, a 404 error is generated.

PATCH - admin privileges required.
      - requires one of { name, website, description, difficulty (one of Beginner, Intermediate, Advanced), safety, location }
      - if editing { location }, requires one of { address_line, city, region, postal_code }
      - if editing location ONLY, body format must be: { "location": { "key": "value" }}

DELETE - admin privileges required.
       - deletes selected trail

#### '/:trail_id/comments' and '/:trail_id/ratings'
GET - returns comments or ratings of selected trail. If trail_id doesn't match that of any existing trail, a 404 error is generated.

### BaseURL/comments - Authorisation required

#### '/:trail_id'
POST - adds comment to selected trail ID. 
     - requires { content }, trail_id and user_id are generated automatically based on parameters. 
     - if trail_id doesn't match that of any existing trail, a 404 error is generated.

#### '/flagged'
GET - admin privileges required
    - returns all flagged comments

#### '/:comment_id'
GET - returns specified comment

PATCH - edits specified comment { content }
      - returns a 404 error if comment_id doesn't match that of any existing comment.
      - returns a 401 unauthorised error if the user is neither the comment's author nor an admin.

#### '/flag/:comment_id'
PATCH - flags/unflags specified comment
      - returns an error if you're flagging your own comment
      - returns a 404 error if comment_id doesn't match that of any existing comment.

### BaseURL/ratings - Authorisation required
#### '/:trail_id'
POST - adds rating to selected trail
     - requires { rating }, trail_id and user_id are automatically generated based on parameters.
     - if trail_id doesn't match that of an existing trail, a 404 error is returned.

#### '/:rating_id'
GET - returns specified rating object
    - if rating_id doesn't match that of any existing rating, a 404 error is returned.

PATCH - edits specified rating { rating }
      - can only be edited by the rating's associated user
      - returns a 404 error if rating_id doesn't match that of any existing rating
      - returns a 401 unauthorised error if the user is trying to edit a rating not associated to them

### BaseURL/pending - Authorisation required
#### '/'
GET - returns all pending messages
    - admin privileges required

POST - creates a new pending message for site admins
     - requires { message }

#### '/:pending_id' - Requires admin privileges
GET - retrieves specified pending message
    - returns a 404 error if pending_id doesn't match that of any existing pending message

DELETE - deletes specified pending message
        - returns a 404 error if pending_id doesn't match that of any existing pending message

## Technologies and languages used &#x202b; תכנולוגיות ושפות בשימוש

* Javascript
* PostgreSQL
* Express
* PostgratorCLI
* Knex
* Helmet
* BcryptJS
* Chai
* Mocha
* Nodemon
* Supertest
