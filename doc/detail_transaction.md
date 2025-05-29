# Transaction Detail API Documentation

## Transaction Detail Table Structure
```sql
detail_transactions {
    id_detail: INTEGER (Primary Key, Auto Increment)
    id_transaction: INTEGER (Foreign Key references transactions.id_transaction)
    id_product: INTEGER (Foreign Key references products.id_product)
    quantity: INTEGER
}
```

## Create Transaction Detail
**Endpoint:** `POST /api/transaction-details`

**Description:** Add a product to a transaction

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "id_transaction": 1,
    "id_product": 5,
    "quantity": 2
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "Transaction detail created successfully",
    "data": {
        "id_detail": 1,
        "id_transaction": 1,
        "id_product": 5,
        "quantity": 2,
        "product_info": {
            "id_product": 5,
            "product_name": "iPhone 15 Pro",
            "price": 999.99,
            "stock": 48
        },
        "line_total": 1999.98
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Insufficient stock",
    "errors": ["Only 1 item available in stock"]
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Transaction or product not found",
    "errors": ["Invalid transaction ID or product ID"]
}
```

**Response Error (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        "Transaction ID is required",
        "Product ID is required",
        "Quantity must be a positive integer"
    ]
}
```

## Bulk Create Transaction Details
**Endpoint:** `POST /api/transaction-details/bulk`

**Description:** Add multiple products to a transaction at once

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "id_transaction": 1,
    "items": [
        {
            "id_product": 5,
            "quantity": 2
        },
        {
            "id_product": 3,
            "quantity": 1
        },
        {
            "id_product": 8,
            "quantity": 3
        }
    ]
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "Transaction details created successfully",
    "data": {
        "id_transaction": 1,
        "details": [
            {
                "id_detail": 1,
                "id_product": 5,
                "quantity": 2,
                "product_info": {
                    "product_name": "iPhone 15 Pro",
                    "price": 999.99
                },
                "line_total": 1999.98
            },
            {
                "id_detail": 2,
                "id_product": 3,
                "quantity": 1,
                "product_info": {
                    "product_name": "MacBook Pro",
                    "price": 1999.99
                },
                "line_total": 1999.99
            }
        ],
        "transaction_total": 3999.97
    }
}
```

## Get Transaction Details by Transaction ID
**Endpoint:** `GET /api/transactions/:transactionId/details`

**Description:** Get all details for a specific transaction

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "transaction": {
            "id_transaction": 1,
            "date": "2025-05-27T10:30:00.000Z",
            "total_price": 3999.97,
            "status": "completed"
        },
        "details": [
            {
                "id_detail": 1,
                "id_product": 5,
                "quantity": 2,
                "product_info": {
                    "id_product": 5,
                    "product_name": "iPhone 15 Pro",
                    "price": 999.99,
                    "category": "Electronics"
                },
                "line_total": 1999.98
            },
            {
                "id_detail": 2,
                "id_product": 3,
                "quantity": 1,
                "product_info": {
                    "id_product": 3,
                    "product_name": "MacBook Pro",
                    "price": 1999.99,
                    "category": "Electronics"
                },
                "line_total": 1999.99
            }
        ],
        "summary": {
            "total_items": 2,
            "total_quantity": 3,
            "subtotal": 3999.97
        }
    }
}
```

## Get Transaction Detail by ID
**Endpoint:** `GET /api/transaction-details/:id`

**Description:** Get a specific transaction detail by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "id_detail": 1,
        "id_transaction": 1,
        "id_product": 5,
        "quantity": 2,
        "product_info": {
            "id_product": 5,
            "product_name": "iPhone 15 Pro",
            "price": 999.99,
            "stock": 48,
            "category": "Electronics"
        },
        "transaction_info": {
            "id_transaction": 1,
            "date": "2025-05-27T10:30:00.000Z",
            "status": "completed"
        },
        "line_total": 1999.98
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Transaction detail not found"
}
```

## Update Transaction Detail
**Endpoint:** `PUT /api/transaction-details/:id`

**Description:** Update a transaction detail (only for pending transactions)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "quantity": 3
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Transaction detail updated successfully",
    "data": {
        "id_detail": 1,
        "id_transaction": 1,
        "id_product": 5,
        "quantity": 3,
        "previous_quantity": 2,
        "product_info": {
            "product_name": "iPhone 15 Pro",
            "price": 999.99
        },
        "line_total": 2999.97
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Cannot update completed transaction",
    "errors": ["Transaction detail cannot be modified after completion"]
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Insufficient stock",
    "errors": ["Only 2 items available in stock"]
}
```

## Delete Transaction Detail
**Endpoint:** `DELETE /api/transaction-details/:id`

**Description:** Remove a product from a transaction (only for pending transactions)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Transaction detail deleted successfully",
    "data": {
        "deleted_detail": {
            "id_detail": 1,
            "product_name": "iPhone 15 Pro",
            "quantity": 2,
            "line_total": 1999.98
        },
        "updated_transaction_total": 1999.99
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Cannot delete from completed transaction",
    "errors": ["Transaction detail cannot be removed after completion"]
}
```

## Get All Transaction Details
**Endpoint:** `GET /api/transaction-details`

**Description:** Get all transaction details with pagination and filtering

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `transaction_id` (optional): Filter by transaction ID
- `product_id` (optional): Filter by product ID
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "details": [
            {
                "id_detail": 1,
                "id_transaction": 1,
                "id_product": 5,
                "quantity": 2,
                "product_info": {
                    "product_name": "iPhone 15 Pro",
                    "price": 999.99
                },
                "transaction_info": {
                    "date": "2025-05-27T10:30:00.000Z",
                    "status": "completed"
                },
                "line_total": 1999.98
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 25,
            "total_details": 250,
            "per_page": 10
        }
    }
}
```

## Get Product Sales Report
**Endpoint:** `GET /api/transaction-details/product-sales`

**Description:** Get sales report for products

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)
- `product_id` (optional): Specific product ID
- `category_id` (optional): Filter by category
- `limit` (optional): Number of results (default: 20)

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "period": {
            "date_from": "2025-05-01",
            "date_to": "2025-05-27"
        },
        "product_sales": [
            {
                "id_product": 5,
                "product_name": "iPhone 15 Pro",
                "category": "Electronics",
                "price": 999.99,
                "total_quantity_sold": 45,
                "total_revenue": 44999.55,
                "total_transactions": 32
            },
            {
                "id_product": 3,
                "product_name": "MacBook Pro",
                "category": "Electronics",
                "price": 1999.99,
                "total_quantity_sold": 12,
                "total_revenue": 23999.88,
                "total_transactions": 11
            }
        ],
        "summary": {
            "total_products": 2,
            "total_quantity_sold": 57,
            "total_revenue": 68999.43
        }
    }
}
```

## Update Product Quantity in Transaction
**Endpoint:** `PATCH /api/transaction-details/:id/quantity`

**Description:** Update only the quantity of a transaction detail

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "quantity": 4,
    "operation": "set"
}
```

**Alternative Operations:**
```json
{
    "quantity": 1,
    "operation": "add"
}
```

```json
{
    "quantity": 1,
    "operation": "subtract"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Quantity updated successfully",
    "data": {
        "id_detail": 1,
        "previous_quantity": 2,
        "current_quantity": 4,
        "product_name": "iPhone 15 Pro",
        "unit_price": 999.99,
        "line_total": 3999.96
    }
}
```

## Error Codes
- **400** - Bad Request (Insufficient stock, cannot modify completed transaction)
- **401** - Unauthorized (Invalid or missing token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Transaction detail, transaction, or product not found)
- **422** - Unprocessable Entity (Validation errors)
- **500** - Internal Server Error

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

## Role Permissions
- **admin**: Full access to all transaction detail endpoints
- **manager**: Can view, create, update transaction details and access reports
- **cashier**: Can create and view transaction details for current transactions

## Validation Rules
- **id_transaction**: 
  - Required
  - Must reference an existing transaction
  - Transaction must be in 'pending' status for modifications
- **id_product**: 
  - Required
  - Must reference an existing product
  - Product must have sufficient stock
- **quantity**: 
  - Required
  - Must be a positive integer
  - Cannot exceed available stock

## Business Rules
- Transaction details can only be added/modified for pending transactions
- Stock is automatically reduced when transaction details are created
- Stock is restored when transaction details are deleted or quantities reduced
- Line total is automatically calculated as quantity × product price
