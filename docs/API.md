# API Documentation

This document describes the serverless API endpoints provided by Netlify Functions in the WCI@NYP application.

## Overview

All API endpoints are serverless functions deployed on Netlify. They handle authentication, form submissions, and other backend operations.

Base URL: `/.netlify/functions/`

## Authentication

Most endpoints require authentication via Supabase JWT tokens passed in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Submit Form
**POST** `/.netlify/functions/submit-form`

Submits form data and stores it in the system.

#### Request Body
```json
{
  "formId": 123,
  "formName": "Patient Registration",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-0123"
  },
  "submittedAt": "2025-01-01T12:00:00Z"
}
```

#### Response
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "uuid-here"
}
```

#### Error Response
```json
{
  "error": "Failed to submit form",
  "details": "Rate limit exceeded"
}
```

### 2. Submit Access Request
**POST** `/.netlify/functions/submit-access-request`

Submits a request for access to the application.

#### Request Body
```json
{
  "email": "user@med.cornell.edu",
  "fullName": "Dr. Jane Smith",
  "organization": "Weill Cornell Medicine",
  "role": "Physician",
  "reason": "Need access to patient imaging data"
}
```

#### Response
```json
{
  "success": true,
  "message": "Access request submitted successfully"
}
```

#### Validation
- Email must be from an approved domain (@med.cornell.edu, @weill.cornell.edu, @nyp.org)
- All fields are required
- Rate limited to prevent spam

### 3. Check Admin Status
**GET** `/.netlify/functions/check-admin-status`

Checks if the authenticated user has admin privileges.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response
```json
{
  "isAdmin": true,
  "email": "admin@med.cornell.edu",
  "userId": "uuid-here"
}
```

#### Error Response
```json
{
  "isAdmin": false,
  "error": "Unauthorized"
}
```

### 4. Get Documents
**GET** `/.netlify/functions/get-documents`

Retrieves the list of available documents.

#### Query Parameters
- `category` (optional) - Filter by category
- `search` (optional) - Search term
- `limit` (optional) - Number of results (default: 50)
- `offset` (optional) - Pagination offset

#### Example Request
```
GET /.netlify/functions/get-documents?category=forms&search=patient&limit=10
```

#### Response
```json
{
  "documents": [
    {
      "id": "doc-1",
      "name": "Patient Registration Form",
      "category": "forms",
      "url": "/documents/forms/patient-registration.pdf",
      "size": 245000,
      "lastUpdated": "2025-01-01T10:00:00Z"
    }
  ],
  "total": 156,
  "categories": [
    {
      "name": "forms",
      "count": 89
    },
    {
      "name": "policies",
      "count": 34
    }
  ]
}
```

### 5. Auth Callback
**POST** `/.netlify/functions/auth-callback`

Handles authentication callbacks from Supabase.

#### Request Body
```json
{
  "access_token": "jwt-token",
  "refresh_token": "refresh-token",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@med.cornell.edu"
  }
}
```

#### Response
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@med.cornell.edu",
    "isAdmin": false
  }
}
```

### 6. Rate Limiter
**Middleware Function**

Not directly accessible - used internally by other functions to implement rate limiting.

## Rate Limiting

All endpoints implement rate limiting using Upstash Redis:

- **Default Limits**: 5 requests per minute for form submissions
- **Auth Endpoints**: 10 requests per 5 minutes
- **Document Retrieval**: 30 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1704123660
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Brief error message",
  "details": "Detailed error information",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `RATE_LIMITED` - Too many requests
- `VALIDATION_ERROR` - Invalid request data
- `INTERNAL_ERROR` - Server error

## CORS

All endpoints include CORS headers to allow requests from the frontend:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

## Security

1. **Authentication**: Most endpoints require valid Supabase JWT tokens
2. **Rate Limiting**: Prevents abuse and DoS attacks
3. **Input Validation**: All inputs are validated and sanitized
4. **Error Messages**: Sensitive information is never exposed in error messages
5. **Logging**: All requests are logged for audit purposes

## Examples

### Submit a Form with Authentication

```javascript
const response = await fetch('/.netlify/functions/submit-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    formId: 123,
    formName: 'Patient Registration',
    data: formData,
    submittedAt: new Date().toISOString()
  })
});

const result = await response.json();
```

### Check Admin Status

```javascript
const response = await fetch('/.netlify/functions/check-admin-status', {
  headers: {
    'Authorization': `Bearer ${session.access_token}`
  }
});

const { isAdmin } = await response.json();
```

### Search Documents

```javascript
const params = new URLSearchParams({
  category: 'forms',
  search: 'consent',
  limit: '20'
});

const response = await fetch(`/.netlify/functions/get-documents?${params}`);
const { documents, total } = await response.json();
```

## Development

### Local Testing

Functions can be tested locally using Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run functions locally
netlify dev

# Functions will be available at http://localhost:8888/.netlify/functions/
```

### Environment Variables

Required environment variables for functions:

```bash
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Rate Limiting
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Email Domains
ALLOWED_EMAIL_DOMAINS=med.cornell.edu,weill.cornell.edu,nyp.org
```

### Adding New Functions

1. Create a new file in `netlify/functions/`
2. Export a handler function:

```typescript
import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  // Your function logic
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' })
  }
}
```

3. Add rate limiting if needed
4. Document the endpoint in this file
5. Add tests for the function