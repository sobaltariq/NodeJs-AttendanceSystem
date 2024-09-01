const mongoose = require("mongoose");
// for env
require("dotenv").config();

// mongoose
//   .connect(`${process.env.DB_URL}`)
//   .then(() => {
//     console.log(`Mongoose is connected`);
//   })
//   .catch((err) => {
//     console.log(`Error to connect mongoose ${err.message}`);
//   });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Mongoose is connected");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
