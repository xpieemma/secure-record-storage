
import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/7javastudent'); // Connect to the database

export default mongoose.connection; // Export the database connection