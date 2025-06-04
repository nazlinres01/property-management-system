# KiraTakip API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Giriş başarılı",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "userType": "landlord"
  }
}
```

### Register
**POST** `/auth/register`

Request body:
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "userType": "landlord"
}
```

### Logout
**POST** `/auth/logout`

### Get Current User
**GET** `/auth/me`

## Properties

### Get All Properties
**GET** `/properties`

Response:
```json
[
  {
    "id": 1,
    "type": "Daire",
    "address": "Barbaros Bulvarı No:123, Beşiktaş/İstanbul",
    "area": 120,
    "floor": 3,
    "monthlyRent": "25000",
    "isAvailable": false,
    "landlord": {
      "id": 1,
      "name": "Zeynep Koç",
      "email": "zeynep.koc@gmail.com"
    },
    "tenant": {
      "id": 5,
      "name": "Emre Arslan",
      "phone": "+90 532 123 4567"
    },
    "contract": {
      "id": 16,
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2025-01-15T00:00:00.000Z"
    },
    "lastPayment": {
      "id": 22,
      "status": "paid",
      "dueDate": "2024-12-01T00:00:00.000Z"
    }
  }
]
```

### Create Property
**POST** `/properties`

Request body:
```json
{
  "type": "Daire",
  "address": "Sample Address",
  "area": 100,
  "floor": 2,
  "monthlyRent": "20000",
  "landlordId": 1
}
```

### Update Property
**PUT** `/properties/:id`

### Delete Property
**DELETE** `/properties/:id`

## Tenants

### Get All Tenants
**GET** `/tenants`

Response:
```json
[
  {
    "id": 5,
    "name": "Emre Arslan",
    "email": "emre.arslan@email.com",
    "phone": "+90 532 123 4567",
    "nationalId": "12345678901",
    "address": "İstanbul",
    "emergencyContact": "Ayşe Arslan",
    "emergencyPhone": "+90 533 987 6543",
    "createdAt": "2024-01-10T00:00:00.000Z"
  }
]
```

### Create Tenant
**POST** `/tenants`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+90 532 123 4567",
  "nationalId": "12345678901",
  "address": "Sample Address",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "+90 533 987 6543"
}
```

### Update Tenant
**PUT** `/tenants/:id`

### Delete Tenant
**DELETE** `/tenants/:id`

## Landlords

### Get All Landlords
**GET** `/landlords`

Response:
```json
[
  {
    "id": 1,
    "name": "Zeynep Koç",
    "email": "zeynep.koc@gmail.com",
    "phone": "+90 531 234 5678",
    "nationalId": "98765432109",
    "address": "Ankara",
    "taxNumber": "1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Landlord
**POST** `/landlords`

### Update Landlord
**PUT** `/landlords/:id`

### Delete Landlord
**DELETE** `/landlords/:id`

## Contracts

### Get All Contracts
**GET** `/contracts`

Response:
```json
[
  {
    "id": 16,
    "landlordId": 1,
    "tenantId": 5,
    "propertyId": 10,
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2025-01-15T00:00:00.000Z",
    "monthlyRent": "25000",
    "securityDeposit": "50000",
    "status": "active",
    "tenant": {
      "id": 5,
      "name": "Emre Arslan",
      "email": "emre.arslan@email.com"
    },
    "property": {
      "id": 10,
      "address": "Barbaros Bulvarı No:123, Beşiktaş/İstanbul",
      "type": "Daire"
    },
    "landlord": {
      "id": 1,
      "name": "Zeynep Koç",
      "email": "zeynep.koc@gmail.com"
    }
  }
]
```

### Create Contract
**POST** `/contracts`

Request body:
```json
{
  "landlordId": 1,
  "tenantId": 5,
  "propertyId": 10,
  "startDate": "2024-01-15",
  "endDate": "2025-01-15",
  "monthlyRent": "25000",
  "securityDeposit": "50000"
}
```

## Payments

### Get All Payments
**GET** `/payments`

Response:
```json
[
  {
    "id": 22,
    "status": "paid",
    "tenantId": 5,
    "contractId": 16,
    "amount": "25000",
    "dueDate": "2024-12-01T00:00:00.000Z",
    "paidDate": "2024-11-28T00:00:00.000Z",
    "tenant": {
      "id": 5,
      "name": "Emre Arslan",
      "email": "emre.arslan@email.com"
    },
    "contract": {
      "id": 16,
      "property": {
        "id": 10,
        "address": "Barbaros Bulvarı No:123, Beşiktaş/İstanbul"
      }
    }
  }
]
```

### Get Pending Payments
**GET** `/payments/pending`

### Get Overdue Payments
**GET** `/payments/overdue`

### Create Payment
**POST** `/payments`

Request body:
```json
{
  "tenantId": 5,
  "contractId": 16,
  "amount": "25000",
  "dueDate": "2024-12-01",
  "status": "pending"
}
```

### Update Payment
**PUT** `/payments/:id`

## Dashboard Statistics

### Get Dashboard Stats
**GET** `/dashboard/stats`

Response:
```json
{
  "totalTenants": 5,
  "activeProperties": 4,
  "monthlyIncome": 95000,
  "pendingPayments": 2
}
```

## AI Chat System

### Get Chat Status
**GET** `/chat/status`

Response:
```json
{
  "activeConnections": 0,
  "status": "online"
}
```

### WebSocket Connection
**WebSocket** `/ws`

Connect to WebSocket for real-time chat functionality.

Message format:
```json
{
  "type": "chat_message",
  "message": "User message",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Error Responses

### Validation Error
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authentication Error
```json
{
  "message": "Unauthorized"
}
```

### Not Found Error
```json
{
  "message": "Resource not found"
}
```

### Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

- API requests are limited to 100 requests per minute per IP
- WebSocket connections are limited to 10 concurrent connections per user

## Data Export

### Export Properties
**GET** `/properties/export`

Returns CSV file with all property data.

### Export Tenants
**GET** `/tenants/export`

Returns CSV file with all tenant data.

### Export Payments
**GET** `/payments/export`

Returns CSV file with all payment data.