const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    accessToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);