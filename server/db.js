import { MongoClient } from "mongodb";

let client = null;
let database = null;

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return false;
  }

  if (database) {
    return true;
  }

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();

  database = client.db(
    process.env.MONGODB_DB_NAME || "apna-anaj"
  );

  await database.command({ ping: 1 });

  return true;
}

export function getMongoDB() {
  if (!database) {
    throw new Error(
      "MongoDB is not connected. Set MONGODB_URI in the backend environment."
    );
  }

  return database;
}

export function isMongoConnected() {
  return Boolean(database);
}
