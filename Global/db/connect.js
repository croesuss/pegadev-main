import mongoose from "mongoose";
import config from "@global/config";

let connectionPromise = null;

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.mongo, {
      autoIndex: true
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
  return mongoose.connection;
}

export default connectMongo;
