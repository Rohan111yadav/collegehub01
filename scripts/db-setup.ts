import "dotenv/config";
import { pool } from "../src/lib/db";

async function setupDatabase() {
  console.log("Setting up database tables in PostgreSQL...");

  const queries = [
    // Clean up existing tables
    `DROP TABLE IF EXISTS "RecentlyViewed" CASCADE;`,
    `DROP TABLE IF EXISTS "Comparison" CASCADE;`,
    `DROP TABLE IF EXISTS "Favorite" CASCADE;`,
    `DROP TABLE IF EXISTS "College" CASCADE;`,
    `DROP TABLE IF EXISTS "User" CASCADE;`,

    // 1. User Table
    `CREATE TABLE IF NOT EXISTS "User" (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 2. College Table
    `CREATE TABLE IF NOT EXISTS "College" (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      fees INTEGER NOT NULL,
      rating DOUBLE PRECISION NOT NULL,
      placements DOUBLE PRECISION NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      courses JSONB NOT NULL,
      reviews JSONB NOT NULL,
      "establishedYear" INTEGER NOT NULL,
      type VARCHAR(255) NOT NULL,
      accreditation VARCHAR(255) NOT NULL,
      website VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 3. Favorite Table
    `CREATE TABLE IF NOT EXISTS "Favorite" (
      id VARCHAR(255) PRIMARY KEY,
      "userId" VARCHAR(255) NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
      "collegeId" VARCHAR(255) NOT NULL REFERENCES "College"(id) ON DELETE CASCADE,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fav_user_college_unique UNIQUE ("userId", "collegeId")
    );`,

    // 4. Comparison Table
    `CREATE TABLE IF NOT EXISTS "Comparison" (
      id VARCHAR(255) PRIMARY KEY,
      "userId" VARCHAR(255) NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
      "collegeIds" TEXT[] NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 5. RecentlyViewed Table
    `CREATE TABLE IF NOT EXISTS "RecentlyViewed" (
      id VARCHAR(255) PRIMARY KEY,
      "userId" VARCHAR(255) NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
      "collegeId" VARCHAR(255) NOT NULL REFERENCES "College"(id) ON DELETE CASCADE,
      "viewedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT recent_user_college_unique UNIQUE ("userId", "collegeId")
    );`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (err) {
      console.error("Error executing query:", query);
      console.error(err);
      process.exit(1);
    }
  }

  console.log("Database tables checked/created successfully!");
}

setupDatabase()
  .catch((err) => {
    console.error("Database setup failed:", err);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
