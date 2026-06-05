const mongoose = require('mongoose');

let isConnected = false;
let dbType = 'mongodb';

const connectDB = async () => {
  try {
    // Try to connect to local/env MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/avon_portal', {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout
    });
    isConnected = true;
    dbType = 'mongodb';
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message}`);
    console.warn('FALLING BACK TO SYSTEM FILE STORAGE (JSON DATABASE ENGINE). MongoDB not required.');
    dbType = 'json';
    isConnected = true;
  }
  return { dbType, isConnected };
};

const getDbType = () => dbType;

module.exports = { connectDB, getDbType };
