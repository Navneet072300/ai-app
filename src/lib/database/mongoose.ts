import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// @ts-expect-error: mongoose property does not exist on global yet
let cached: MongooseConnection = global.mongoose;

if (!cached) {
  // @ts-expect-error: Assigning mongoose property to global for caching
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "imagine",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
