# Maslool App Server &#x202b; שרת של האתר ״מסלול״ 
<br />

BaseURL: https://still-journey-41951.herokuapp.com/api

## Documentation &#x202b; תיעוד 
<br />

### BaseURL/users
GET - requires admin privileges / returns all users
    - if the user is neither logged in nor an admin, it will return a 401 unauthorised error. 
    - if the user is an admin, it will return a list of all users.

POST - registers new user
    - required: { username, password, email }
    - Password must contain at least one upper case, lower case, number, and special characters, be more than 8 characters and less than 72 characters long, and have no spaces at the beginning or at the end.
    - Email needs to be in a valid email format.



