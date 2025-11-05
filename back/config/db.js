// for mongoDB connection try...catch → catches errors if connection fails.
// process.exit(1) → stops program if it can’t connect.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose v6+ uses sensible defaults; explicit options like useNewUrlParser
    // and useUnifiedTopology are deprecated and not necessary.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
