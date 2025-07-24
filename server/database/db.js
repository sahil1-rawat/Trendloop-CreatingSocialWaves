import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: 'SocialMediaDB',
    });
    console.log(`Connected to MongoDB with name SocialMediaDB on ${process.env.DB_URL}`);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
