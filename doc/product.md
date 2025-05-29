# Product API Documentation

## Product Table Structure
```sql
products {
    id_product: INTEGER (Primary Key, Auto Increment)
    product_name: VARCHAR(100) (Unique)
    price: DECIMAL(10,2)
    stock: INTEGER
    desc: TEXT
    id_category: INTEGER (Foreign Key references categories.id_category)
    created_at: TIMESTAMP (Default: CURRENT_TIMESTAMP)
    updated_at: TIMESTAMP (Default: CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
}
```

## Create Product
**Endpoint:** `POST /api/products`

**Description:** Create a new product

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "product_name": "iPhone 15 Pro",
    "price": 999.99,
    "stock": 50,
    "desc": "Latest iPhone with advanced camera system and A17 Pro chip",
    "id_category": 1
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "id_product": 1,
        "product_name": "iPhone 15 Pro",
        "price": 999.99,
        "stock": 50,
        "desc": "Latest iPhone with advanced camera system and A17 Pro chip",
        "id_category": 1,
        "category": {
            "id_category": 1,
            "category_name": "Electronics"
        },
        "created_at": "2025-05-27T10:30:00.000Z",
        "updated_at": "2025-05-27T10:30:00.000Z"
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Product name already exists",
    "errors": ["Product name must be unique"]
}
```

**Response Error (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        "Product name is required",
        "Price must be a positive number",
        "Stock must be a non-negative integer",
        "Category ID is required"
    ]
}
```

## Get All Products
**Endpoint:** `GET /api/products`

**Description:** Retrieve all products with pagination and filtering

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by product name
- `category` (optional): Filter by category ID
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `in_stock` (optional): Filter products in stock (true/false)

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "id_product": 1,
                "product_name": "iPhone 15 Pro",
                "price": 999.99,
                "stock": 50,
                "desc": "Latest iPhone with advanced camera system",
                "id_category": 1,
                "category": {
                    "id_category": 1,
                    "category_name": "Electronics"
                },
                "created_at": "2025-05-27T10:30:00.000Z",
                "updated_at": "2025-05-27T10:30:00.000Z"
            },
            {
                "id_product": 2,
                "product_name": "Samsung Galaxy S24",
                "price": 799.99,
                "stock": 30,
                "desc": "Premium Android smartphone",
                "id_category": 1,
                "category": {
                    "id_category": 1,
                    "category_name": "Electronics"
                },
                "created_at": "2025-05-26T14:20:00.000Z",
                "updated_at": "2025-05-27T09:15:00.000Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_products": 50,
            "per_page": 10
        }
    }
}
```

## Get Product by ID
**Endpoint:** `GET /api/products/:id`

**Description:** Retrieve a specific product by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "id_product": 1,
        "product_name": "iPhone 15 Pro",
        "price": 999.99,
        "stock": 50,
        "desc": "Latest iPhone with advanced camera system and A17 Pro chip",
        "id_category": 1,
        "category": {
            "id_category": 1,
            "category_name": "Electronics"
        },
        "created_at": "2025-05-27T10:30:00.000Z",
        "updated_at": "2025-05-27T10:30:00.000Z"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Product not found"
}
```

## Update Product
**Endpoint:** `PUT /api/products/:id`

**Description:** Update an existing product

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "product_name": "iPhone 15 Pro Max",
    "price": 1099.99,
    "stock": 45,
    "desc": "Latest iPhone with largest display and advanced camera system",
    "id_category": 1
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Product updated successfully",
    "data": {
        "id_product": 1,
        "product_name": "iPhone 15 Pro Max",
        "price": 1099.99,
        "stock": 45,
        "desc": "Latest iPhone with largest display and advanced camera system",
        "id_category": 1,
        "category": {
            "id_category": 1,
            "category_name": "Electronics"
        },
        "created_at": "2025-05-27T10:30:00.000Z",
        "updated_at": "2025-05-27T11:45:00.000Z"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Product not found"
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Product name already exists",
    "errors": ["Product name must be unique"]
}
```

## Update Product Stock
**Endpoint:** `PATCH /api/products/:id/stock`

**Description:** Update product stock quantity

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "stock": 25,
    "operation": "set"
}
```

**Alternative Operations:**
```json
{
    "quantity": 10,
    "operation": "add"
}
```

```json
{
    "quantity": 5,
    "operation": "subtract"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Stock updated successfully",
    "data": {
        "id_product": 1,
        "product_name": "iPhone 15 Pro",
        "previous_stock": 50,
        "current_stock": 25,
        "updated_at": "2025-05-27T12:00:00.000Z"
    }
}
```

## Delete Product
**Endpoint:** `DELETE /api/products/:id`

**Description:** Delete a product (Admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Product deleted successfully"
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Product not found"
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
    "message": "Cannot delete product: Product has pending transactions"
}
```

## Search Products
**Endpoint:** `GET /api/products/search`

**Description:** Search products by name or description

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `q`: Search query (required)
- `limit` (optional): Maximum results (default: 10)
- `category` (optional): Filter by category ID

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "id_product": 1,
                "product_name": "iPhone 15 Pro",
                "price": 999.99,
                "stock": 50,
                "desc": "Latest iPhone with advanced camera system",
                "id_category": 1,
                "category": {
                    "id_category": 1,
                    "category_name": "Electronics"
                },
                "created_at": "2025-05-27T10:30:00.000Z",
                "updated_at": "2025-05-27T10:30:00.000Z"
            }
        ],
        "total_results": 1
    }
}
```

## Get Products by Category
**Endpoint:** `GET /api/products/category/:categoryId`

**Description:** Get all products in a specific category

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "category": {
            "id_category": 1,
            "category_name": "Electronics"
        },
        "products": [
            {
                "id_product": 1,
                "product_name": "iPhone 15 Pro",
                "price": 999.99,
                "stock": 50,
                "desc": "Latest iPhone with advanced camera system",
                "created_at": "2025-05-27T10:30:00.000Z",
                "updated_at": "2025-05-27T10:30:00.000Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "total_products": 1,
            "per_page": 10
        }
    }
}
```

## Get Low Stock Products
**Endpoint:** `GET /api/products/low-stock`

**Description:** Get products with low stock levels

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `threshold` (optional): Stock threshold (default: 10)
- `limit` (optional): Maximum results (default: 20)

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "id_product": 3,
                "product_name": "MacBook Pro",
                "price": 1999.99,
                "stock": 5,
                "desc": "Professional laptop",
                "id_category": 1,
                "category": {
                    "id_category": 1,
                    "category_name": "Electronics"
                },
                "created_at": "2025-05-25T08:00:00.000Z",
                "updated_at": "2025-05-27T09:30:00.000Z"
            }
        ],
        "threshold": 10,
        "total_low_stock": 1
    }
}
```

## Error Codes
- **400** - Bad Request (Invalid input data, duplicate product name)
- **401** - Unauthorized (Invalid or missing token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Product or category not found)
- **409** - Conflict (Cannot delete product with pending transactions)
- **422** - Unprocessable Entity (Validation errors)
- **500** - Internal Server Error

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

## Role Permissions
- **admin**: Full access to all product endpoints
- **manager**: Can create, read, update products and manage stock
- **cashier**: Read-only access to products

## Validation Rules
- **product_name**: 
  - Required
  - Must be unique
  - Maximum length: 100 characters
  - Cannot be empty or contain only whitespace
- **price**: 
  - Required
  - Must be a positive decimal number
  - Maximum 2 decimal places
- **stock**: 
  - Required
  - Must be a non-negative integer
- **desc**: 
  - Optional
  - Maximum length: 1000 characters
- **id_category**: 
  - Required
  - Must reference an existing category
- **created_at**: 
  - Auto-generated on product creation
  - Cannot be modified after creation
- **updated_at**: 
  - Auto-updated whenever product data is modified
  - Includes stock changes, price updates, description changes
