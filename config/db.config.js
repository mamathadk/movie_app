const mongoose = require("mongoose");

const dbConfig = {
  url: "mongodb://localhost:27017/moviesdb",
};

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database!");
  } catch (err) {
    console.error("Cannot connect to the database!", err);
    process.exit(1);
  }
};

module.exports = connectDB;
//module.exports = dbConfig;
