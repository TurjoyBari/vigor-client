import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "vigor";

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const globalForMongo = globalThis;

function getMongoClient() {
  if (!globalForMongo.__vigorAuthMongoClient) {
    globalForMongo.__vigorAuthMongoClient = new MongoClient(mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
    });
  }
  return globalForMongo.__vigorAuthMongoClient;
}

const client = getMongoClient();
const db = client.db(dbName);

function getTrustedOrigins() {
  const origins = new Set([
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  ]);

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  origins.add("https://*.vercel.app");

  const extra = process.env.BETTER_AUTH_TRUSTED_ORIGINS || "";
  extra
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .forEach((origin) => origins.add(origin));

  return [...origins].filter(Boolean);
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
  trustedOrigins: getTrustedOrigins(),
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
});
