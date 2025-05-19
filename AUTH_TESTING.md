# Testing JWT Authentication with Postman

This guide explains how to test the JWT authentication flow using Postman.

## Setup Environment Variables

First, set up environment variables in Postman:

1. Create a new environment (e.g., "Ice Animation API")
2. Add the following variables:
   - `baseUrl`: `http://localhost:3000` (adjust if using a different port)
   - `accessToken`: Leave empty (will be filled automatically)
   - `refreshToken`: Leave empty (will be filled automatically)

## Authentication Endpoints

### 1. Register a New User

- **Method**: POST
- **URL**: `{{baseUrl}}/auth/register`
- **Body** (raw JSON):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "password": "Password123!"
}
```

- **Response**: This will return user information, an access token, and a refresh token.
- **Post-request Script** (to automatically save tokens):
```javascript
const response = pm.response.json();
if (response.accessToken) {
    pm.environment.set('accessToken', response.accessToken);
}
if (response.refreshToken) {
    pm.environment.set('refreshToken', response.refreshToken);
}
```

### 2. Login

- **Method**: POST
- **URL**: `{{baseUrl}}/auth/login`
- **Body** (raw JSON):
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

- **Response**: This will return user information, an access token, and a refresh token.
- **Post-request Script** (to automatically save tokens):
```javascript
const response = pm.response.json();
if (response.accessToken) {
    pm.environment.set('accessToken', response.accessToken);
}
if (response.refreshToken) {
    pm.environment.set('refreshToken', response.refreshToken);
}
```

### 3. Access Protected Resource

- **Method**: GET
- **URL**: `{{baseUrl}}/user` (or any protected route)
- **Authorization**: 
  - Type: Bearer Token
  - Token: `{{accessToken}}`

### 4. Refresh Token

- **Method**: POST
- **URL**: `{{baseUrl}}/auth/refresh`
- **Body** (raw JSON):
```json
{
  "refreshToken": "{{refreshToken}}"
}
```
- **Authorization**: 
  - Type: Bearer Token
  - Token: `{{refreshToken}}`

- **Response**: This will return new access and refresh tokens.
- **Post-request Script** (to automatically save new tokens):
```javascript
const response = pm.response.json();
if (response.accessToken) {
    pm.environment.set('accessToken', response.accessToken);
}
if (response.refreshToken) {
    pm.environment.set('refreshToken', response.refreshToken);
}
```

### 5. Logout

- **Method**: POST
- **URL**: `{{baseUrl}}/auth/logout`
- **Authorization**: 
  - Type: Bearer Token
  - Token: `{{accessToken}}`

## Testing Flow

1. Register a user or login with existing credentials
2. Use the received access token to access protected resources
3. When the access token expires (after 15 minutes by default), use the refresh token to get a new access token
4. Use the new access token for subsequent requests
5. When finished, logout to invalidate the refresh token

## Common HTTP Status Codes

- 201: Successfully registered
- 200: Successfully logged in, token refreshed, or logged out
- 401: Unauthorized (invalid credentials or token)
- 403: Forbidden (insufficient permissions)
- 409: Conflict (e.g., email already exists during registration)
