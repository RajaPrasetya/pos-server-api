# Category API Documentation

## Category Table Structure
```sql
categories {
    id_category: INTEGER (Primary Key, Auto Increment)
    category_name: VARCHAR(100) (Unique)
}
```

## Create Category
**Endpoint:** `POST /api/categories`

**Description:** Create a new category

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "category_name": "Electronics"
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "Category created successfully",
    "data": {
        "id_category": 1,
        "category_name": "Electronics"
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Category name already exists",
    "errors": ["Category name must be unique"]
}
```

**Response Error (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": ["Category name is required"]
}
```

## Get All Categories
**Endpoint:** `GET /api/categories`

**Description:** Retrieve all categories

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by category name

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "categories": [
            {
                "id_category": 1,
                "category_name": "Electronics"
            },
            {
                "id_category": 2,
                "category_name": "Clothing"
            },
            {
                "id_category": 3,
                "category_name": "Food & Beverages"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "total_categories": 3,
            "per_page": 10
        }
    }
}
```

## Get Category by ID
**Endpoint:** `GET /api/categories/:id`

**Description:** Retrieve a specific category by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "id_category": 1,
        "category_name": "Electronics"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Category not found"
}
```

## Update Category
**Endpoint:** `PUT /api/categories/:id`

**Description:** Update an existing category

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "category_name": "Electronics & Gadgets"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Category updated successfully",
    "data": {
        "id_category": 1,
        "category_name": "Electronics & Gadgets"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Category not found"
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Category name already exists",
    "errors": ["Category name must be unique"]
}
```

**Response Error (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": ["Category name is required"]
}
```

## Delete Category
**Endpoint:** `DELETE /api/categories/:id`

**Description:** Delete a category (Admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Category deleted successfully"
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Category not found"
}
```

**Response Error (403):**
```json
{
    "success": false,
    "message": "Forbidden: Admin access required"
}
```

**Response Error (409):**
```json
{
    "success": false,
    "message": "Cannot delete category: Products are associated with this category"
}
```

## Search Categories
**Endpoint:** `GET /api/categories/search`

**Description:** Search categories by name

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `q`: Search query (required)
- `limit` (optional): Maximum results (default: 10)

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "categories": [
            {
                "id_category": 1,
                "category_name": "Electronics"
            }
        ],
        "total_results": 1
    }
}
```

## Error Codes
- **400** - Bad Request (Invalid input data, duplicate category name)
- **401** - Unauthorized (Invalid or missing token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Category not found)
- **409** - Conflict (Cannot delete category with associated products)
- **422** - Unprocessable Entity (Validation errors)
- **500** - Internal Server Error

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

## Role Permissions
- **admin**: Full access to all category endpoints
- **manager**: Can create, read, and update categories
- **cashier**: Read-only access to categories