# User API Documentation

## User Table Structure
```sql
users {
    id_user: INTEGER (Primary Key, Auto Increment)
    username: VARCHAR(50) (Unique)
    password: VARCHAR(255) (Hashed)
    email: VARCHAR(100) (Unique)
    role: ENUM('admin', 'cashier', 'manager')
}
```

## Register
**Endpoint:** `POST /api/users/register`

**Description:** Create a new user account

**Request Body:**
```json
{
    "username": "john_doe",
    "password": "securePassword123",
    "email": "john@example.com",
    "role": "cashier"
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id_user": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "cashier"
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Username already exists",
    "errors": ["Username must be unique"]
}
```

## Login
**Endpoint:** `POST /api/users/login`

**Description:** Authenticate user and get access token

**Request Body:**
```json
{
    "username": "john_doe",
    "password": "securePassword123"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id_user": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "role": "cashier"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Response Error (401):**
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

## Get User
**Endpoint:** `GET /api/users/:id`

**Description:** Get user details by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "id_user": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "cashier"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "User not found"
}
```

## Get All Users
**Endpoint:** `GET /api/users`

**Description:** Get all users (Admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "users": [
            {
                "id_user": 1,
                "username": "john_doe",
                "email": "john@example.com",
                "role": "cashier"
            },
            {
                "id_user": 2,
                "username": "jane_admin",
                "email": "jane@example.com",
                "role": "admin"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "total_users": 2
        }
    }
}
```

## Update User
**Endpoint:** `PUT /api/users/:id`

**Description:** Update user information

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "username": "john_updated",
    "email": "john.updated@example.com",
    "role": "manager"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id_user": 1,
        "username": "john_updated",
        "email": "john.updated@example.com",
        "role": "manager"
    }
}
```

**Response Error (403):**
```json
{
    "success": false,
    "message": "Forbidden: Insufficient permissions"
}
```

## Change Password
**Endpoint:** `PUT /api/users/:id/password`

**Description:** Change user password

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "current_password": "oldPassword123",
    "new_password": "newSecurePassword456"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Current password is incorrect"
}
```

## Delete User
**Endpoint:** `DELETE /api/users/:id`

**Description:** Delete user account (Admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

**Response Error (403):**
```json
{
    "success": false,
    "message": "Forbidden: Admin access required"
}
```

## Logout
**Endpoint:** `POST /api/users/logout`

**Description:** Logout user and invalidate token

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Logout successful"
}
```

## Error Codes
- **400** - Bad Request (Invalid input data)
- **401** - Unauthorized (Invalid credentials or token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (User not found)
- **409** - Conflict (Username/email already exists)
- **500** - Internal Server Error

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

## Role Permissions
- **admin**: Full access to all endpoints
- **manager**: Can view and update users, cannot delete
- **cashier**: Can only view and update own profile