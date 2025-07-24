import mongoose from 'mongoose';
import { User } from '../models/userModel';

mongoose.connect('mongodb+srv://Sahil:sahilmedia@cluster0.smq4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(async () => {
  await User.updateMany(
    { isAdmin: { $exists: false } },
    { $set: { isAdmin: false } }
  );
  //console.log('All users updated with isAdmin: false');
  mongoose.disconnect();
});
