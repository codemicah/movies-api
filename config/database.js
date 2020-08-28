require("dotenv").config();
const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

module.exports.connect = ()=>{
    mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, success)=>{
          if(!error) return console.log("database connected successfully");
          return console.log("could not connect to database");
      });
}