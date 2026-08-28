import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/retech');
    console.log(`MongoDB Connected: `);
  } catch (error) {
    console.error(Error: );
    process.exit(1);
  }
};