import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoConnectString = process.env.MONGO_URL;

if (!mongoConnectString) {
  throw new Error('MONGO_URL is not defined in the environment variables');
}

export async function dbConnection() {
  const client = new MongoClient(mongoConnectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('MongoDB connected successfully');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export const ObjectId = MongoClient.ObjectId;

// This ensures that the connection is established before exporting the client
const client = await dbConnection();
export { client };
