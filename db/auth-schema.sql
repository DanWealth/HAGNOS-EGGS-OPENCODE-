DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS verification;
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE NOT NULL, "emailVerified" BOOLEAN DEFAULT FALSE, image TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW());
CREATE TABLE session (id TEXT PRIMARY KEY, "userId" TEXT REFERENCES "user"(id) ON DELETE CASCADE, token TEXT UNIQUE NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "ipAddress" TEXT, "userAgent" TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW());
CREATE TABLE account (id TEXT PRIMARY KEY, "userId" TEXT REFERENCES "user"(id) ON DELETE CASCADE, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL, "accessToken" TEXT, "refreshToken" TEXT, "idToken" TEXT, "accessTokenExpiresAt" TIMESTAMP, "refreshTokenExpiresAt" TIMESTAMP, scope TEXT, password TEXT, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW());
CREATE TABLE verification (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW());
