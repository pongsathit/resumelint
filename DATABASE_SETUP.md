# Database Setup Guide - ResumeLint

This document explains the PostgreSQL database configuration for the ResumeLint project.

## Overview

The ResumeLint project uses **PostgreSQL 16** (Alpine Linux variant) as its database service. The database is containerized and runs within the Docker Compose network alongside the backend and frontend services.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Frontend   │────▶│   Backend   │────▶│  PostgreSQL  │
│   (React)   │     │  (Express)  │     │  (Database)  │
└─────────────┘     └─────────────┘     └──────────────┘
     :5173              :3000          Internal only
```

### Key Design Decisions

1. **No External Port Exposure**: The database is NOT exposed to the host machine by default. This follows production security best practices.
2. **Internal Network Only**: Backend connects to database using service name `database` as hostname.
3. **Named Volume**: Database data persists across container restarts using `resumelint_postgres_data` volume.
4. **Health Checks**: Database readiness is verified before backend starts.

## Configuration Files

### 1. docker-compose.yml

The database service configuration:

```yaml
database:
  image: postgres:16-alpine
  container_name: resumelint-database
  environment:
    POSTGRES_DB: ${POSTGRES_DB:-resumelint}
    POSTGRES_USER: ${POSTGRES_USER:-resumelint_user}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-resumelint_password}
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - resumelint-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-resumelint_user} -d ${POSTGRES_DB:-resumelint}"]
    interval: 10s
    timeout: 5s
    start_period: 30s
    retries: 5
```

### 2. Environment Variables

**Root `.env` (for Docker Compose)**:
```bash
POSTGRES_DB=resumelint
POSTGRES_USER=resumelint_user
POSTGRES_PASSWORD=resumelint_password
```

**Backend `.env`**:
```bash
DATABASE_HOST=database
DATABASE_PORT=5432
DATABASE_NAME=resumelint
DATABASE_USER=resumelint_user
DATABASE_PASSWORD=resumelint_password
```

## Usage Instructions

### Starting the Database

The database starts automatically with docker-compose:

```bash
# Start all services (backend depends on database health check)
docker-compose up -d

# Check database status
docker-compose ps database

# View database logs
docker-compose logs -f database
```

### Connecting to the Database

#### Option 1: From Backend Container (Recommended)

```bash
# Execute psql from backend container
docker-compose exec backend psql -h database -U resumelint_user -d resumelint
```

#### Option 2: From Database Container

```bash
# Access PostgreSQL shell directly
docker-compose exec database psql -U resumelint_user -d resumelint

# Run SQL commands
docker-compose exec database psql -U resumelint_user -d resumelint -c "SELECT version();"
```

#### Option 3: Using Database GUI Tools (Optional)

To connect with tools like pgAdmin, DBeaver, or TablePlus, you need to expose the database port:

1. Edit `docker-compose.yml` and add ports to the database service:
   ```yaml
   database:
     ports:
       - "${POSTGRES_PORT:-5432}:5432"
   ```

2. Add to `.env`:
   ```bash
   POSTGRES_PORT=5432
   ```

3. Restart the database:
   ```bash
   docker-compose restart database
   ```

4. Connect using:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `resumelint`
   - **User**: `resumelint_user`
   - **Password**: `resumelint_password`

**WARNING**: Do not expose database ports in production environments!

### Database Management

#### View Database Information

```bash
# List all databases
docker-compose exec database psql -U resumelint_user -d postgres -c "\l"

# List all tables in resumelint database
docker-compose exec database psql -U resumelint_user -d resumelint -c "\dt"

# Describe a specific table
docker-compose exec database psql -U resumelint_user -d resumelint -c "\d table_name"
```

#### Create Database Backup

```bash
# Backup to file
docker-compose exec database pg_dump -U resumelint_user resumelint > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
docker-compose exec database pg_dump -U resumelint_user -Fc resumelint > backup_$(date +%Y%m%d_%H%M%S).dump
```

#### Restore Database Backup

```bash
# From SQL file
docker-compose exec -T database psql -U resumelint_user -d resumelint < backup.sql

# From compressed dump
docker-compose exec -T database pg_restore -U resumelint_user -d resumelint -Fc backup.dump
```

#### Reset Database

```bash
# Option 1: Drop and recreate all tables (preserves database)
docker-compose exec database psql -U resumelint_user -d resumelint -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Option 2: Remove volume and recreate (complete reset)
docker-compose down
docker volume rm resumelint_postgres_data
docker-compose up -d
```

### Data Persistence

The database data is stored in a Docker named volume:

```bash
# View volume information
docker volume inspect resumelint_postgres_data

# List all project volumes
docker volume ls | grep resumelint

# Remove database volume (DELETES ALL DATA!)
docker volume rm resumelint_postgres_data
```

## Integration with Backend

### Current State: Mock Data

The backend currently uses in-memory mock data (Maps in `/backend/src/models/mockData.ts`). No database connection is active yet.

### Future Integration

When you're ready to integrate the database with your backend, you'll need to:

1. **Install a PostgreSQL Client Library**:
   ```bash
   cd backend
   npm install pg
   npm install --save-dev @types/pg
   ```

   Or use an ORM like Prisma or TypeORM:
   ```bash
   # Prisma
   npm install prisma @prisma/client
   npx prisma init

   # TypeORM
   npm install typeorm reflect-metadata
   ```

2. **Create Database Schema**:
   - Define tables matching your TypeScript interfaces (User, Resume, Analysis, etc.)
   - Use migrations to manage schema changes
   - Run migrations on container startup

3. **Update Services**:
   - Replace mock data Maps with actual database queries
   - Implement connection pooling
   - Add error handling and transaction support

4. **Optional: Create Initialization Script**:
   Create `docker/postgres/init.sql` with your schema and seed data:
   ```sql
   -- Example schema
   CREATE TABLE users (
     id VARCHAR(255) PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     name VARCHAR(255) NOT NULL,
     avatar VARCHAR(500),
     subscription_tier VARCHAR(50) DEFAULT 'free',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   Then uncomment the init script mount in `docker-compose.yml`:
   ```yaml
   volumes:
     - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
   ```

## Troubleshooting

### Database Not Starting

```bash
# Check logs for errors
docker-compose logs database

# Common issues:
# 1. Port already in use (if exposed)
# 2. Volume permission issues
# 3. Invalid environment variables
```

### Backend Cannot Connect

```bash
# Verify database is healthy
docker-compose ps database

# Check network connectivity
docker-compose exec backend ping database

# Verify environment variables
docker-compose exec backend env | grep DATABASE

# Test connection manually
docker-compose exec backend psql -h database -U resumelint_user -d resumelint
```

### Data Not Persisting

```bash
# Verify volume exists
docker volume ls | grep resumelint

# Check if volume is mounted correctly
docker-compose exec database df -h /var/lib/postgresql/data

# Ensure you're not using docker-compose down -v (which removes volumes)
```

### Performance Issues

```bash
# Monitor database activity
docker-compose exec database psql -U resumelint_user -d resumelint -c "SELECT * FROM pg_stat_activity;"

# Check database size
docker-compose exec database psql -U resumelint_user -d resumelint -c "SELECT pg_size_pretty(pg_database_size('resumelint'));"

# View slow queries (requires pg_stat_statements extension)
docker-compose exec database psql -U resumelint_user -d resumelint -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"
```

## Environment Variable Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `resumelint` | Database name |
| `POSTGRES_USER` | `resumelint_user` | Database user |
| `POSTGRES_PASSWORD` | `resumelint_password` | Database password (change in production!) |
| `DATABASE_HOST` | `database` | Database hostname (service name) |
| `DATABASE_PORT` | `5432` | Database port (internal) |
| `POSTGRES_PORT` | - | Host port mapping (optional, for GUI tools) |

## Security Considerations

1. **Change Default Password**: The default password is for development only. Use a strong password in production.
2. **No External Exposure**: Database is not accessible from outside the Docker network by default.
3. **Environment Variables**: Never commit `.env` files with real credentials to git.
4. **Use Secrets Management**: For production, use Docker Secrets or environment variable injection from CI/CD.
5. **Connection Pooling**: Implement connection limits to prevent resource exhaustion.
6. **SSL/TLS**: Enable SSL for database connections in production.

## Production Considerations

When deploying to production:

1. **Use Managed Database Services**: Consider AWS RDS, Google Cloud SQL, or Azure Database for PostgreSQL
2. **Implement Backups**: Set up automated daily backups with point-in-time recovery
3. **Enable Monitoring**: Use tools like pgAdmin, DataDog, or New Relic for database monitoring
4. **Configure Resource Limits**: Set appropriate CPU and memory limits in docker-compose
5. **Use Strong Credentials**: Generate secure passwords using password managers
6. **Enable SSL**: Require SSL connections for all database access
7. **Implement Rate Limiting**: Prevent abuse with connection rate limiting
8. **Regular Updates**: Keep PostgreSQL version updated for security patches

## Useful Commands Cheat Sheet

```bash
# Start database only
docker-compose up -d database

# Stop database
docker-compose stop database

# Restart database
docker-compose restart database

# View database logs (live)
docker-compose logs -f database

# Access PostgreSQL shell
docker-compose exec database psql -U resumelint_user -d resumelint

# Run SQL file
docker-compose exec -T database psql -U resumelint_user -d resumelint < script.sql

# Database health check
docker-compose exec database pg_isready -U resumelint_user -d resumelint

# Database stats
docker-compose exec database psql -U resumelint_user -d resumelint -c "\l+"

# Connection count
docker-compose exec database psql -U resumelint_user -d resumelint -c "SELECT count(*) FROM pg_stat_activity;"

# Vacuum analyze (optimize)
docker-compose exec database psql -U resumelint_user -d resumelint -c "VACUUM ANALYZE;"
```

## Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/16/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres)
- [Node.js pg Library](https://node-postgres.com/)
- [Prisma ORM](https://www.prisma.io/docs)
- [TypeORM](https://typeorm.io/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker Compose logs: `docker-compose logs database`
3. Verify environment variables in `.env` files
4. Ensure database health check is passing: `docker-compose ps database`
