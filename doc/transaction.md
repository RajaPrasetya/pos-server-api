# Transaction API Documentation

## Transaction Table Structure
```sql
transactions {
    id_transaction: INTEGER (Primary Key, Auto Increment)
    total_price: DECIMAL(10,2)
    payment_method: INTEGER (Foreign Key references payment_methods.id_payment)
    status: ENUM('pending', 'completed', 'cancelled', 'refunded')
    id_user: INTEGER (Foreign Key references users.id_user)
    created_at: TIMESTAMP (Default: CURRENT_TIMESTAMP)
    updated_at: TIMESTAMP (Default: CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
}
```

## Create Transaction
**Endpoint:** `POST /api/transactions`

**Description:** Create a new transaction

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "total_price": 299.98,
    "payment_method": 1,
    "status": "pending"
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "Transaction created successfully",
    "data": {
        "id_transaction": 1,
        "total_price": 299.98,
        "payment_method": 1,
        "status": "pending",
        "id_user": 3,
        "user_info": {
            "id_user": 3,
            "username": "john_cashier",
            "role": "cashier"
        },
        "payment_info": {
            "id_payment": 1,
            "payment_method": "Credit Card"
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
    "message": "Invalid payment method",
    "errors": ["Payment method does not exist"]
}
```

**Response Error (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        "Total price is required",
        "Total price must be a positive number",
        "Payment method is required",
        "Status must be one of: pending, completed, cancelled, refunded"
    ]
}
```

## Get All Transactions
**Endpoint:** `GET /api/transactions`

**Description:** Retrieve all transactions with pagination and filtering

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `payment_method` (optional): Filter by payment method ID
- `user_id` (optional): Filter by user ID
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)
- `min_amount` (optional): Minimum transaction amount
- `max_amount` (optional): Maximum transaction amount

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "transactions": [
            {
                "id_transaction": 1,
                "total_price": 299.98,
                "payment_method": 1,
                "status": "completed",
                "id_user": 3,
                "user_info": {
                    "id_user": 3,
                    "username": "john_cashier",
                    "role": "cashier"
                },
                "payment_info": {
                    "id_payment": 1,
                    "payment_method": "Credit Card"
                },
                "created_at": "2025-05-27T10:30:00.000Z",
                "updated_at": "2025-05-27T11:00:00.000Z"
            },
            {
                "id_transaction": 2,
                "total_price": 89.99,
                "payment_method": 3,
                "status": "completed",
                "id_user": 2,
                "user_info": {
                    "id_user": 2,
                    "username": "jane_manager",
                    "role": "manager"
                },
                "payment_info": {
                    "id_payment": 3,
                    "payment_method": "Cash"
                },
                "created_at": "2025-05-27T11:45:00.000Z",
                "updated_at": "2025-05-27T11:45:00.000Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 15,
            "total_transactions": 150,
            "per_page": 10
        },
        "summary": {
            "total_amount": 12567.89,
            "completed_transactions": 142,
            "pending_transactions": 5,
            "cancelled_transactions": 2,
            "refunded_transactions": 1
        }
    }
}
```

## Get Transaction by ID
**Endpoint:** `GET /api/transactions/:id`

**Description:** Retrieve a specific transaction by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "id_transaction": 1,
        "total_price": 299.98,
        "payment_method": 1,
        "status": "completed",
        "id_user": 3,
        "user_info": {
            "id_user": 3,
            "username": "john_cashier",
            "role": "cashier"
        },
        "payment_info": {
            "id_payment": 1,
            "payment_method": "Credit Card"
        },
        "created_at": "2025-05-27T10:30:00.000Z",
        "updated_at": "2025-05-27T11:00:00.000Z"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Transaction not found"
}
```

## Update Transaction
**Endpoint:** `PUT /api/transactions/:id`

**Description:** Update an existing transaction

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "total_price": 319.98,
    "payment_method": 2,
    "status": "completed"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Transaction updated successfully",
    "data": {
        "id_transaction": 1,
        "total_price": 319.98,
        "payment_method": 2,
        "status": "completed",
        "id_user": 3,
        "user_info": {
            "id_user": 3,
            "username": "john_cashier",
            "role": "cashier"
        },
        "payment_info": {
            "id_payment": 2,
            "payment_method": "Debit Card"
        },
        "created_at": "2025-05-27T10:30:00.000Z",
        "updated_at": "2025-05-27T12:15:00.000Z"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Transaction not found"
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Cannot update completed transaction",
    "errors": ["Transaction status does not allow modifications"]
}
```

## Update Transaction Status
**Endpoint:** `PATCH /api/transactions/:id/status`

**Description:** Update only the transaction status

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "status": "completed"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Transaction status updated successfully",
    "data": {
        "id_transaction": 1,
        "previous_status": "pending",
        "current_status": "completed",
        "updated_at": "2025-05-27T12:00:00.000Z"
    }
}
```

## Cancel Transaction
**Endpoint:** `PATCH /api/transactions/:id/cancel`

**Description:** Cancel a pending transaction

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Transaction cancelled successfully",
    "data": {
        "id_transaction": 1,
        "status": "cancelled",
        "updated_at": "2025-05-27T12:00:00.000Z"
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Cannot cancel transaction",
    "errors": ["Only pending transactions can be cancelled"]
}
```

## Refund Transaction
**Endpoint:** `PATCH /api/transactions/:id/refund`

**Description:** Process a refund for a completed transaction

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "refund_reason": "Customer request",
    "refund_amount": 299.98
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Transaction refunded successfully",
    "data": {
        "id_transaction": 1,
        "status": "refunded",
        "refund_amount": 299.98,
        "refund_reason": "Customer request",
        "updated_at": "2025-05-27T12:00:00.000Z"
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Cannot refund transaction",
    "errors": ["Only completed transactions can be refunded"]
}
```

## Delete Transaction
**Endpoint:** `DELETE /api/transactions/:id`

**Description:** Delete a transaction (Admin only, only pending transactions)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Transaction deleted successfully"
}
```

**Response Error (403):**
```json
{
    "success": false,
    "message": "Forbidden: Admin access required"
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Cannot delete transaction",
    "errors": ["Only pending transactions can be deleted"]
}
```

## Get Transaction Statistics
**Endpoint:** `GET /api/transactions/statistics`

**Description:** Get transaction statistics and analytics

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `period` (optional): Time period (today, week, month, year)
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)
- `user_id` (optional): Filter by specific user

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "period": "today",
        "total_transactions": 45,
        "total_revenue": 3456.78,
        "average_transaction": 76.82,
        "status_breakdown": {
            "completed": 42,
            "pending": 2,
            "cancelled": 1,
            "refunded": 0
        },
        "payment_method_breakdown": {
            "Credit Card": {
                "count": 25,
                "total": 2100.50
            },
            "Cash": {
                "count": 15,
                "total": 980.28
            },
            "Digital Wallet": {
                "count": 5,
                "total": 376.00
            }
        },
        "user_performance": [
            {
                "id_user": 3,
                "username": "john_cashier",
                "transactions": 18,
                "total_amount": 1456.78
            },
            {
                "id_user": 2,
                "username": "jane_manager",
                "transactions": 15,
                "total_amount": 1200.50
            }
        ]
    }
}
```

## Get Transactions by Date Range
**Endpoint:** `GET /api/transactions/date-range`

**Description:** Get transactions within a specific date range

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `start_date`: Start date (YYYY-MM-DD) (required)
- `end_date`: End date (YYYY-MM-DD) (required)
- `status` (optional): Filter by status
- `payment_method` (optional): Filter by payment method
- `user_id` (optional): Filter by user ID

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "date_range": {
            "start_date": "2025-05-01",
            "end_date": "2025-05-27"
        },
        "transactions": [
            {
                "id_transaction": 1,
                "total_price": 299.98,
                "payment_method": 1,
                "status": "completed",
                "id_user": 3,
                "user_info": {
                    "username": "john_cashier",
                    "role": "cashier"
                },
                "payment_info": {
                    "payment_method": "Credit Card"
                },
                "created_at": "2025-05-27T10:30:00.000Z",
                "updated_at": "2025-05-27T11:00:00.000Z"
            }
        ],
        "summary": {
            "total_transactions": 127,
            "total_revenue": 15678.90,
            "average_daily_revenue": 580.70
        }
    }
}
```

## Error Codes
- **400** - Bad Request (Invalid input data, invalid status transition)
- **401** - Unauthorized (Invalid or missing token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Transaction not found)
- **422** - Unprocessable Entity (Validation errors)
- **500** - Internal Server Error

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

## Role Permissions
- **admin**: Full access to all transaction endpoints
- **manager**: Can view, create, update transactions and access statistics
- **cashier**: Can create and view transactions, limited update permissions

## Transaction Status Flow
```
pending → completed
pending → cancelled
completed → refunded
```

## Validation Rules
- **total_price**: 
  - Required
  - Must be a positive decimal number
  - Maximum 2 decimal places
- **payment_method**: 
  - Required
  - Must reference an existing payment method
- **status**: 
  - Required
  - Must be one of: pending, completed, cancelled, refunded
- **id_user**: 
  - Auto-filled from JWT token (authenticated user)
  - Cannot be modified after creation
- **created_at**: 
  - Auto-generated on transaction creation
  - Cannot be modified after creation
- **updated_at**: 
  - Auto-updated whenever transaction data is modified
  - Updates on status changes, amount updates