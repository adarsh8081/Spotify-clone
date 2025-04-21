import mongoose from 'mongoose';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spotify-clone';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');

    // PostgreSQL connection
    const postgresConnection = await createConnection({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'spotify_clone',
      entities: ['src/entities/**/*.ts'],
      synchronize: process.env.NODE_ENV !== 'production', // Don't use synchronize in production
      logging: process.env.NODE_ENV === 'development'
    });

    console.log('PostgreSQL Connected...');
    return { mongoose, postgres: postgresConnection };
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}; 