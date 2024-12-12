const mongoose= require("mongoose");
require("dotenv").config();
const url =
  process.env.DB;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Could not connect to DB", err);
  }
};

module.exports = connectDB