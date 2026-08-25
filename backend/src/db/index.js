import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('Database Error');
    throw error;
  }
}

export { connectDB };
