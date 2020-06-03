## `Producer App Server`

### `Routes`

### `/api/signup`

### `POST`
takes `username`, `email` and `password`.
verifies that password is between 8 and 72 characters and contains a capital letter and symbol.
verifies that username is not already taken.

### `/api/login`

### `POST`
takes `username` and `password` and checks if they are correct. If so it uses jsonwebtoken
to login with 30 minute timeout.

### `GET`
Uses jsonwebtoken to verify person is still logged in. If they are it returns the users
`username` and `lyrics`

### `/api/update`

### `POST`
Verifies person is still logged in. Takes `username` and `lyrics` and inserts/updates lyrics to users account

## `Technologies Used`

Express, Javascript, Node, Heroku
