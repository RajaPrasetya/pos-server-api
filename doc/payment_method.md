# Payment Method API Documentation

## Payment Method Table Structure
```sql
payment_methods {
    id_payment: INTEGER (Primary Key, Auto Increment)
    payment_method: VARCHAR(50) (Unique)
}
```

## Create Payment Method
**Endpoint:** `POST /api/payment-methods`

**Description:** Create a new payment method

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "payment_method": "Credit Card"
}
```

**Response Success (201):**
```json
{
    "success": true,
    "message": "Payment method created successfully",
    "data": {
        "id_payment": 1,
        "payment_method": "Credit Card"
    }
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Payment method already exists",
    "errors": ["Payment method must be unique"]
}
```

**Response Error (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": ["Payment method is required"]
}
```

## Get All Payment Methods
**Endpoint:** `GET /api/payment-methods`

**Description:** Retrieve all payment methods

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by payment method name

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "payment_methods": [
            {
                "id_payment": 1,
                "payment_method": "Credit Card"
            },
            {
                "id_payment": 2,
                "payment_method": "Debit Card"
            },
            {
                "id_payment": 3,
                "payment_method": "Cash"
            },
            {
                "id_payment": 4,
                "payment_method": "Digital Wallet"
            },
            {
                "id_payment": 5,
                "payment_method": "Bank Transfer"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 1,
            "total_payment_methods": 5,
            "per_page": 10
        }
    }
}
```

## Get Payment Method by ID
**Endpoint:** `GET /api/payment-methods/:id`

**Description:** Retrieve a specific payment method by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "id_payment": 1,
        "payment_method": "Credit Card"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Payment method not found"
}
```

## Update Payment Method
**Endpoint:** `PUT /api/payment-methods/:id`

**Description:** Update an existing payment method

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "payment_method": "Visa Credit Card"
}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Payment method updated successfully",
    "data": {
        "id_payment": 1,
        "payment_method": "Visa Credit Card"
    }
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Payment method not found"
}
```

**Response Error (400):**
```json
{
    "success": false,
    "message": "Payment method already exists",
    "errors": ["Payment method must be unique"]
}
```

**Response Error (422):**
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": ["Payment method is required"]
}
```

## Delete Payment Method
**Endpoint:** `DELETE /api/payment-methods/:id`

**Description:** Delete a payment method (Admin only)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "message": "Payment method deleted successfully"
}
```

**Response Error (404):**
```json
{
    "success": false,
    "message": "Payment method not found"
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
    "message": "Cannot delete payment method: Transactions are associated with this payment method"
}
```

## Search Payment Methods
**Endpoint:** `GET /api/payment-methods/search`

**Description:** Search payment methods by name

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
        "payment_methods": [
            {
                "id_payment": 1,
                "payment_method": "Credit Card"
            },
            {
                "id_payment": 2,
                "payment_method": "Debit Card"
            }
        ],
        "total_results": 2
    }
}
```

## Get Active Payment Methods
**Endpoint:** `GET /api/payment-methods/active`

**Description:** Get only active/enabled payment methods for transactions

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
    "success": true,
    "data": {
        "payment_methods": [
            {
                "id_payment": 1,
                "payment_method": "Credit Card"
            },
            {
                "id_payment": 2,
                "payment_method": "Cash"
            },
            {
                "id_payment": 3,
                "payment_method": "Digital Wallet"
            }
        ],
        "total_active": 3
    }
}
```

## Error Codes
- **400** - Bad Request (Invalid input data, duplicate payment method)
- **401** - Unauthorized (Invalid or missing token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Payment method not found)
- **409** - Conflict (Cannot delete payment method with associated transactions)
- **422** - Unprocessable Entity (Validation errors)
- **500** - Internal Server Error

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

## Role Permissions
- **admin**: Full access to all payment method endpoints
- **manager**: Can create, read, and update payment methods
- **cashier**: Read-only access to payment methods

## Validation Rules
- **payment_method**: 
  - Required
  - Must be unique
  - Maximum length: 50 characters
  - Cannot be empty or contain only whitespace
  - Common values: "Cash", "Credit Card", "Debit Card", "Digital Wallet", "Bank Transfer", "Check"

## Usage Examples

### Creating a new payment method:
```bash
curl -X POST http://localhost:3000/api/payment-methods \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "PayPal"}'
```

### Getting all payment methods:
```bash
curl -X GET http://localhost:3000/api/payment-methods \
  -H "Authorization: Bearer your_token_here"
```

### Updating a payment method:
```bash
curl -X PUT http://localhost:3000/api/payment-methods/1 \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "Mastercard Credit Card"}'
```

### Searching payment methods:
```bash
curl -X GET "http://localhost:3000/api/payment-methods/search?q=card" \
  -H "Authorization: Bearer your_token_here"
```

### Getting active payment methods for POS:
```bash
curl -X GET http://localhost:3000/api/payment-methods/active \
  -H "Authorization: Bearer your_token_here"
```

### Deleting a payment method:
```bash
curl -X DELETE http://localhost:3000/api/payment-methods/1 \
  -H "Authorization: Bearer your_token_here"
```

## Common Payment Methods in Indonesia

In Indonesia, the following payment methods are commonly used:

1. **Cash (Tunai)** - Still widely used for everyday transactions

2. **Bank Transfers (Transfer Bank)** - Very popular for online payments
    - BCA, Mandiri, BNI, BRI, and other local banks

3. **E-wallets/Digital Wallets**:
    - GoPay (by Gojek)
    - OVO
    - DANA
    - LinkAja
    - ShopeePay

4. **QRIS (Quick Response Code Indonesian Standard)** - Unified QR code payment system