import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

const connectDB = async (retries = 5): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error while connecting to MongoDB:', error);
    if (retries > 0) {
      setTimeout(() => connectDB(retries - 1), 10000);
    } else {
      console.error('Could not connect to MongoDB after multiple attempts. Exiting.');
      process.exit(1);
    }
  }
};

export default connectDB;
