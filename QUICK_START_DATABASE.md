# Quick Start: Database Setup

This guide helps you quickly set up and use the PostgreSQL database for ResumeLint.

## Step 1: Configure Environment Variables

Copy the example environment files:

```bash
# Root directory (for Docker Compose)
cp .env.example .env

# Backend directory (for backend application)
cp backend/.env.example backend/.env
```

The default values work fine for local development. In production, **change the database password**!

## Step 2: Start the Database

Start all services (the database will be created automatically):

```bash
docker-compose up -d
```

This command will:
1. Pull the PostgreSQL 16 Alpine image
2. Create a new database named `resumelint`
3. Create a database user `resumelint_user`
4. Set up persistent storage volume
5. Start the backend (which waits for database health check)
6. Start the frontend

## Step 3: Verify Database is Running

Check that all services are healthy:

```bash
docker-compose ps
```

Expected output:
```
NAME                   STATUS                    PORTS
resumelint-backend     Up (healthy)              0.0.0.0:3000->3000/tcp
resumelint-database    Up (healthy)
resumelint-frontend    Up                        0.0.0.0:5173->5173/tcp
```

## Step 4: Access the Database (Optional)

### Option A: From Command Line

```bash
# Access PostgreSQL shell
docker-compose exec database psql -U resumelint_user -d resumelint

# Inside the shell, you can run SQL:
# \dt              - List all tables
# \d table_name    - Describe table structure
# \q               - Quit
```

### Option B: Using a GUI Tool (pgAdmin, DBeaver, etc.)

To connect from a database GUI tool, you need to expose the database port:

1. Edit `.env` and add:
   ```bash
   POSTGRES_PORT=5432
   ```

2. Edit `docker-compose.yml` database service, add:
   ```yaml
   database:
     ports:
       - "${POSTGRES_PORT:-5432}:5432"
   ```

3. Restart:
   ```bash
   docker-compose restart database
   ```

4. Connect using:
   - **Host**: localhost
   - **Port**: 5432
   - **Database**: resumelint
   - **User**: resumelint_user
   - **Password**: resumelint_password

## Step 5: Create Database Schema (When Ready)

Currently, the backend uses mock data. When you're ready to integrate the database:

### Option 1: Use the Example Init Script

```bash
# Copy the example init script
cp docker/postgres/init.sql.example docker/postgres/init.sql

# Edit docker-compose.yml and uncomment the init script volume mount:
# volumes:
#   - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro

# Recreate the database
docker-compose down
docker volume rm resumelint_postgres_data
docker-compose up -d
```

### Option 2: Use an ORM (Recommended)

Install and configure Prisma or TypeORM:

```bash
cd backend

# Prisma
npm install prisma @prisma/client
npx prisma init
# Edit prisma/schema.prisma, then run:
npx prisma migrate dev --name init

# TypeORM
npm install typeorm reflect-metadata pg
# Create entities, then run migrations
```

## Common Commands

```bash
# View database logs
docker-compose logs -f database

# Restart database
docker-compose restart database

# Stop all services
docker-compose down

# Stop and remove volumes (DELETES ALL DATA!)
docker-compose down -v

# Backup database
docker-compose exec database pg_dump -U resumelint_user resumelint > backup.sql

# Restore database
docker-compose exec -T database psql -U resumelint_user -d resumelint < backup.sql
```

## Troubleshooting

### Database won't start

```bash
# Check logs for errors
docker-compose logs database

# Common issue: Port already in use
# Check if PostgreSQL is running outside Docker:
lsof -i :5432

# Kill any existing PostgreSQL process or change the port
```

### Backend can't connect to database

```bash
# Verify database is healthy
docker-compose ps database

# Check network connectivity
docker-compose exec backend ping database

# View backend environment variables
docker-compose exec backend env | grep DATABASE
```

### Need to reset database

```bash
# Complete reset (deletes all data)
docker-compose down
docker volume rm resumelint_postgres_data
docker-compose up -d
```

## Next Steps

1. **Read the full guide**: See `DATABASE_SETUP.md` for detailed documentation
2. **Install a database client**: Install `pg` npm package in backend when ready to integrate
3. **Create schema**: Design and create your database tables
4. **Update services**: Replace mock data with actual database queries
5. **Set up migrations**: Use Prisma or TypeORM for schema management

## Security Reminders

- Change the default password in production
- Never commit `.env` files with real credentials
- Keep database ports closed in production (no external exposure)
- Use environment variable injection in CI/CD
- Enable SSL/TLS for production database connections

## Support

For detailed information, see:
- `DATABASE_SETUP.md` - Complete database documentation
- `docker/README.md` - Docker configuration structure
- `docker/postgres/init.sql.example` - Example schema and seed data
