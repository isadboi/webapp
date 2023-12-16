const mongoose = require("mongoose");
const config = require("config");
const connectDatabase = () => {
  mongoose
    .connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connection established");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
