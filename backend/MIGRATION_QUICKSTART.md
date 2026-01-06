# PostgreSQL Migration - Quick Start Guide

## TL;DR - Run These Commands

```bash
# 1. Navigate to backend directory
cd /Users/pongsathitpoolsawat/resumelint/backend

# 2. Ensure DATABASE_URL is in .env
echo 'DATABASE_URL="postgresql://resumelint_user:resumelint_password@database:5432/resumelint"' >> .env

# 3. Generate Prisma Client
npm run db:generate

# 4. Run migrations (creates all tables)
npm run db:migrate

# 5. Seed database with test users
npm run db:seed

# 6. Start the backend
npm run dev
```

## Test It Works

```bash
# Test with user-1 (FREE tier)
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer access-token-1"

# Test with user-2 (PRO tier)
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer access-token-2"
```

## What Was Created

### Test Users
- **john.doe@example.com** (user-1) - FREE tier, 1 analysis limit
- **jane.smith@example.com** (user-2) - PRO tier, unlimited

### Test Tokens
- `access-token-1` → user-1
- `access-token-2` → user-2
- `refresh-token-1` → user-1
- `refresh-token-2` → user-2

## Database GUI

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

## Common Issues

**"Can't reach database"**
```bash
docker-compose up -d database
```

**"Prisma Client not found"**
```bash
npm run db:generate
```

**"Need to reset everything"**
```bash
npm run db:reset
npm run db:migrate
npm run db:seed
```

## File Summary

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema (10 models) |
| `src/database/client.ts` | Prisma client singleton |
| `src/repositories/*.ts` | Data access layer (7 files) |
| `src/services/*.ts` | Business logic (8 files, now async) |
| `prisma/seed.ts` | Test data creation |

## What Changed in Your Code

### Before (Mock Data)
```typescript
getUserById: (userId: string): User | null => {
  return users.get(userId) || null;
}
```

### After (Database)
```typescript
getUserById: async (userId: string): Promise<User | null> => {
  return await UserRepository.getUserById(userId);
}
```

**Key Change**: All service methods are now `async` and return `Promise<T>`

## What Stayed the Same

- ✅ API endpoints (URLs unchanged)
- ✅ Request/response structures (identical)
- ✅ HTTP status codes (same)
- ✅ Controllers (no changes)
- ✅ Frontend (fully compatible)

## Next Steps

1. Run the migration commands above
2. Test all API endpoints
3. Review `MIGRATION_COMPLETE.md` for full details
4. Monitor logs for any issues

---

**Questions?** Check `MIGRATION_COMPLETE.md` for detailed troubleshooting.
