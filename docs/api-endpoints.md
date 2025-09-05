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

### Get All Users

```
GET /users
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw",
      "email": "temp-xxx@http://localhost:3333",
      "emailVerified": false,
      "name": "Anonymous",
      "image": null,
      "createdAt": "2025-09-05T16:45:18.451Z",
      "updatedAt": "2025-09-05T16:45:18.451Z",
      "isAnonymous": 1
    }
  ],
  "count": 5
}
```

### Get Anonymous Users Only

```
GET /users/anonymous
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw",
      "email": "temp-xxx@http://localhost:3333",
      "name": "Anonymous",
      "isAnonymous": 1,
      "createdAt": "2025-09-05T16:45:18.451Z"
    }
  ],
  "count": 3
}
```

### Get OAuth Users Only

```
GET /users/oauth
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "email": "user@gmail.com",
      "name": "John Doe",
      "image": "https://avatars.googleapis.com/u/123",
      "emailVerified": true,
      "isAnonymous": 0,
      "createdAt": "2025-09-05T10:30:00.000Z"
    }
  ],
  "count": 2
}
```

### Get User Statistics

```
GET /users/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 5,
    "anonymous": 3,
    "oauth": 2,
    "verified": 2
  }
}
```

### Get User by ID

```
GET /users/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw",
    "email": "temp-xxx@http://localhost:3333",
    "name": "Anonymous",
    "image": null,
    "emailVerified": false,
    "isAnonymous": 1,
    "createdAt": "2025-09-05T16:45:18.451Z",
    "updatedAt": "2025-09-05T16:45:18.451Z"
  }
}
```

### Update User

```
PUT /users/:id
```

**Request:**

```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "image": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw",
    "email": "newemail@example.com",
    "name": "Updated Name",
    "image": "https://example.com/avatar.jpg",
    "emailVerified": false,
    "isAnonymous": 1,
    "createdAt": "2025-09-05T16:45:18.451Z",
    "updatedAt": "2025-09-05T16:55:30.123Z"
  },
  "message": "User updated successfully"
}
```

### Delete User (Withdrawal)

```
DELETE /users/:id
```

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "deletedUserId": "tSMIMbcGnqoGpk2y1v3Lekg4WPy7ryAw"
}
```

### Clean up Anonymous Users

```
DELETE /users/cleanup/anonymous
```

**Response:**

```json
{
  "success": true,
  "message": "Deleted 3 anonymous users",
  "deletedCount": 3
}
```

### Error Responses

All endpoints can return error responses in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - User Not Found
- `500` - Internal Server Error
