# Docker Configuration Directory

This directory contains Docker-related configuration files and initialization scripts.

## Structure

```
docker/
└── postgres/
    ├── .gitkeep
    └── init.sql.example    # Example database initialization script
```

## PostgreSQL Initialization Scripts

The `postgres/` directory is designed to hold database initialization scripts that run when the PostgreSQL container is first created.

### How to Use

1. **Copy the example file**:
   ```bash
   cp docker/postgres/init.sql.example docker/postgres/init.sql
   ```

2. **Customize the schema** (optional):
   Edit `init.sql` to match your specific database requirements.

3. **Enable in docker-compose.yml**:
   Uncomment the init script volume mount in the database service:
   ```yaml
   volumes:
     - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
   ```

4. **Create the database**:
   ```bash
   # Remove existing database volume if it exists
   docker-compose down
   docker volume rm resumelint_postgres_data

   # Start with fresh database (init.sql will run)
   docker-compose up -d database
   ```

### Important Notes

- Init scripts **only run on first database creation** when the volume is empty
- To re-run init scripts, you must remove the volume first
- Scripts are executed in alphabetical order if you have multiple files
- The example script creates tables matching the ResumeLint data model

## Adding More Configuration

You can add other Docker-related files here:

- `nginx/` - Nginx reverse proxy configuration
- `redis/` - Redis cache initialization
- `backups/` - Backup scripts
- `monitoring/` - Monitoring tool configurations

## Security Note

Do **NOT** commit `init.sql` with sensitive data (passwords, API keys, real user data) to version control. Keep it in `.gitignore` if it contains secrets.
