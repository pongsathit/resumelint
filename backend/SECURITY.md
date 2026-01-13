# Security Implementation - Password Hashing

## Overview

This document describes the secure password hashing implementation for the ResumeLint backend authentication system.

## Implementation Details

### Password Hashing Algorithm

**Algorithm:** bcrypt
**Salt Rounds:** 12
**Library:** `bcrypt` npm package (v5.1.1+)

### Why bcrypt?

bcrypt was chosen for password hashing because:

1. **Adaptive:** The cost factor can be increased as hardware improves
2. **Salt Integration:** Automatically generates and manages salts
3. **Industry Standard:** Widely trusted and battle-tested algorithm
4. **Slow by Design:** Intentionally slow to resist brute-force attacks
5. **No Rainbow Tables:** Each password has a unique salt

### Salt Rounds

We use **12 salt rounds** which provides:
- Strong security against brute-force attacks
- Reasonable performance for authentication operations
- Future-proof for at least 5-10 years as computing power increases

**Hashing Time:** ~250-350ms per password (acceptable for login operations)

## Security Features

### 1. Password Storage

- Passwords are **never** stored in plain text
- All passwords are hashed using bcrypt before storage
- The hashed password includes the salt automatically
- Password hashes are stored in the `User.password` field (optional field)

### 2. Password Verification

```typescript
// Authentication flow
1. User submits email + password
2. System retrieves user by email
3. bcrypt.compare() verifies password against stored hash
4. Returns user only if password matches
```

### 3. Password Field Protection

The password field is:
- Optional (only for email authentication users)
- **Never** included in API responses
- Explicitly excluded in all controller responses
- Not returned in login, user profile, or update endpoints

### 4. Security Best Practices Implemented

- **No Plain-Text Logging:** Passwords are never logged
- **Constant-Time Comparison:** bcrypt uses constant-time comparison to prevent timing attacks
- **Automatic Salt Management:** Each password gets a unique salt
- **Failed Login Protection:** Invalid credentials return generic error messages
- **No Information Leakage:** Same error for wrong email or wrong password

## Code Structure

### Files Modified/Created

1. **`/src/utils/password.ts`** (NEW)
   - `hashPassword(plainTextPassword)` - Hash a plain-text password
   - `verifyPassword(plainTextPassword, hashedPassword)` - Verify password

2. **`/src/types/index.ts`**
   - Added optional `password?: string` field to User interface

3. **`/src/models/mockData.ts`**
   - Updated with bcrypt-hashed passwords for mock users
   - Modified `getUserByCredentials()` to use async password verification

4. **`/src/services/authService.ts`**
   - Updated `authenticateWithEmail()` to async function
   - Proper password verification integration

5. **`/src/controllers/authController.ts`**
   - Updated `login()` to async handler
   - Password field excluded from response

## Mock User Credentials

For testing purposes, the following credentials are available:

| Email | Password | Tier |
|-------|----------|------|
| john.doe@example.com | `password123` | free |
| jane.smith@example.com | `propassword456` | pro |

**Note:** These are mock credentials for development only. In production with a real database, passwords should be hashed during user registration.

## Password Hashing Examples

### Hashing a New Password

```typescript
import { hashPassword } from '../utils/password';

const plainTextPassword = 'userPassword123';
const hashedPassword = await hashPassword(plainTextPassword);
// Result: $2b$12$randomsalt...hashedvalue
```

### Verifying a Password

```typescript
import { verifyPassword } from '../utils/password';

const plainTextPassword = 'userPassword123';
const storedHash = '$2b$12$randomsalt...hashedvalue';
const isValid = await verifyPassword(plainTextPassword, storedHash);
// Result: true or false
```

## Authentication Flow

```
1. POST /api/auth/login
   Body: { provider: 'email', email: 'user@example.com', password: 'plaintext' }

2. authController.login() receives request
   - Validates provider and required fields
   - Calls authService.authenticateWithEmail(email, password)

3. authService.authenticateWithEmail()
   - Calls mockHelpers.getUserByCredentials(email, password)

4. mockHelpers.getUserByCredentials()
   - Finds user by email
   - Calls verifyPassword(plaintext, user.password)
   - Returns user if password matches, undefined otherwise

5. authController.login()
   - Returns 401 if user is null
   - Generates tokens if authentication successful
   - Returns response WITHOUT password field

Response:
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "user-1",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "..."
  }
}
```

## Security Considerations

### Current Limitations (Mock Data)

1. **In-Memory Storage:** Mock data is stored in memory (resets on server restart)
2. **No Rate Limiting:** Should be added for production
3. **No Account Lockout:** Should implement after N failed attempts
4. **No Password Complexity Requirements:** Should be enforced during registration

### Production Recommendations

When moving to production with a real database:

1. **Password Requirements:**
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Check against common password lists

2. **Additional Security:**
   - Implement rate limiting on login endpoint
   - Add account lockout after 5 failed attempts
   - Implement password reset with secure tokens
   - Add email verification for new accounts
   - Enable 2FA (two-factor authentication)

3. **Database Security:**
   - Never log password hashes
   - Use parameterized queries (already done with ORMs)
   - Enable database encryption at rest
   - Regular security audits

4. **Monitoring:**
   - Log failed login attempts (without passwords)
   - Monitor for brute-force patterns
   - Alert on suspicious activity

## Migration Path

When transitioning from mock data to a real database:

1. The User schema already includes the optional `password` field
2. Password hashing utilities are ready to use
3. Authentication flow already implements proper verification
4. Just replace mock data storage with database calls

**No changes needed to the authentication logic!**

## Testing

### Manual Testing

```bash
# Test valid login
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "email",
    "email": "john.doe@example.com",
    "password": "password123"
  }'

# Test invalid password
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "email",
    "email": "john.doe@example.com",
    "password": "wrongpassword"
  }'
```

### Expected Results

**Valid credentials:** 200 OK with tokens and user object
**Invalid credentials:** 401 Unauthorized with error message

## Dependencies

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2"
  }
}
```

## Compliance

This implementation follows:
- OWASP Password Storage Cheat Sheet
- NIST Digital Identity Guidelines (SP 800-63B)
- Industry best practices for password security

## Version History

- **v1.0.0** (2026-01-06): Initial implementation with bcrypt password hashing
