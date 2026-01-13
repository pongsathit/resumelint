-- AlterTable
-- Add password column to users table for storing bcrypt hashed passwords
-- NULL for OAuth users, VARCHAR(255) for email/password users
ALTER TABLE "users" ADD COLUMN "password" VARCHAR(255);
