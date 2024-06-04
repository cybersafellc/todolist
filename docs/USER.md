# User API Spec

## Created User API

Endpoint : POST /users

Request Body :

```json
{
  "username": "example@gmail.com",
  "password": "rahasia"
}
```

Responses Success Body :

```json
{
  "status": 200,
  "message": "successfully created",
  "data": {
    "username": "example@gmail.com"
  },
  "refrence": null,
  "error": false
}
```

Responses Error Body :

```json
{
  "status": 400,
  "message": "username already exist",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Login Users API

Endpoint : POST /users/login

Request Body :

```json
{
  "username": "example@gmail.com",
  "password": "rahasia"
}
```

Responses Success Body :

```json
{
  "status": 200,
  "message": "successfully login",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMjRhMmRlLWQyMDQtNGVjMy05NjY0LTZlNTgyYzBkMTRkZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3MzEzMjg0LCJleHAiOjE3MTczMTM1ODR9.OHEiDtKfIxAWnHxRJsF_74fxf6JtXVIdsfm9hgBnSsfFVOQ",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiMjRhMmRlLWQyMDQtNGVjMy05NjY0LTZlNTgyYzBkMTRkZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3MzEzMjg0LCJleHAiOjE3MTc5MTgwODR9.QF-lh1xdd0ejfW8DW0drNaaOl7w3-F6bqQPxpdfeeVT5H3_7gpk"
  },
  "refrence": null,
  "error": false
}
```

Responses Error Body :

```json
{
  "status": 400,
  "message": "username and password not match",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Access Token Verify API

Endpoint : GET /users/verify-token

Headers :

- Authorization : access_token

Responses Success Body :

```json
{
  "status": 200,
  "message": "token verified",
  "data": null,
  "refrence": null,
  "error": false
}
```

Responses Error Body :

```json
{
  "status": 400,
  "message": "please provided a valid access_token!",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Refresh Token API

Endpoint : POST /users/refresh-token

Headers :

- Authorization : refresh_token

Responses Success Body :

```json
{
  "status": 200,
  "message": "successfully refresh access_token",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQxZGM0MjNkLTZjNjAtNGY0Zi1hMzVhsdLWIwZDlhNTBmZDJmNiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3NDA0NDEwLCJleHAiOjE3MTc0MDQ3MTB9.P_bh9XUZVGZzM4KDVbkH7LHdVcWzJlJSZ3sadasnaR3IN0iw"
  },
  "refrence": null,
  "error": false
}
```

Responses Error Body :

```json
{
  "status": 400,
  "message": "please provided a valid refresh_token!",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Reset Password API

Endpoint : POST /users/reset-password

Request Body :

```json
{
  "username": "example@gmail.com"
}
```

Responses Success Body :

```json
{
  "status": 200,
  "message": "If the account is already registered, we have sent a password reset link to your email so you can change the new password,",
  "data": null,
  "refrence": null,
  "error": false
}
```

## Reset Password Token Verify

Endpoint : GET /users/reset-password/verify-token

Headers :

- Authorization : reset_password_token

Responses Success Body :

```json
{
  "status": 200,
  "message": "token verified",
  "data": null,
  "refrence": null,
  "error": false
}
```

Responses Error Body :

```json
{
  "status": 400,
  "message": "please provided a valid reset_password_token!",
  "data": null,
  "refrence": null,
  "error": true
}
```

## Update Passowrd

Endpoint : PUT /users/reset-password/update-password

Headers

- Authorization : reset_password_token

Request Body :

```json
{
  "password": "narokay123"
}
```

Responses Success Body :

```json
{
  "status": 200,
  "message": "password successfully updated",
  "data": null,
  "refrence": null,
  "error": false
}
```

Responses Error Body :

```json
{
  "status": 400,
  "message": "please provided a valid reset_password_token!",
  "data": null,
  "refrence": null,
  "error": true
}
```
