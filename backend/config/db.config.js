const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Db Connection established successfully...");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = { ConnectDB };
