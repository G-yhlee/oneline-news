# API Endpoints Summary

## Anonymous Login

### Sign In

```
POST /auth/sign-in/anonymous
```

**Request:**

```json
{}
```

**Response:**

```json
{
  "token": "sK6WZb38FYuRz1iH3EYEjeg2UxL9ypAY",
  "user": {
    "id": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw",
    "email": "temp-xxx@http://localhost:3333",
    "name": "Anonymous"
  }
}
```

## OAuth Login

### Google OAuth

```
POST /auth/sign-in/social/google
```

**Request:**

```json
{
  "callbackURL": "/dashboard"
}
```

**Response:**

```json
{
  "url": "https://accounts.google.com/oauth/authorize?..."
}
```

### GitHub OAuth

```
POST /auth/sign-in/social/github
```

**Request:**

```json
{
  "callbackURL": "/dashboard"
}
```

**Response:**

```json
{
  "url": "https://github.com/login/oauth/authorize?..."
}
```

### OAuth Callbacks

```
GET /auth/callback/google?code=xxx&state=xxx
GET /auth/callback/github?code=xxx&state=xxx
```

**Response:** Redirect to callbackURL with cookie set

## Session Management

### Get Session

```
GET /auth/get-session
Authorization: Bearer {token}
```

**Response:**

```json
{
  "user": {
    "id": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw",
    "email": "temp-xxx@http://localhost:3333",
    "name": "Anonymous"
  },
  "session": {
    "id": "session_id",
    "userId": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw",
    "expiresAt": "2025-09-06T16:45:18.451Z"
  }
}
```

### Sign Out

```
POST /auth/sign-out
Authorization: Bearer {token}
```

**Request:**

```json
{}
```

**Response:**

```json
{
  "success": true
}
```

## User Management

### Find All Users

```
GET /api/infoUsers
```

**Response:**

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
]
```

### Create User

```
POST /api/infoUsers
```

**Request:**

```json
{
  "email": "user@example.com",
  "name": "User Name"
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "User Name"
}
```

### Update User

```
PUT /api/infoUsers/:id
```

**Request:**

```json
{
  "name": "Updated Name"
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Updated Name"
}
```

### Delete User

```
DELETE /api/infoUsers/:id
```

**Response:**

```json
{
  "success": true
}
```
