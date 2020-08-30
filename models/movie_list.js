const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: { type: String },
    user_ref_id: { type: Schema.Types.ObjectId, ref: "user" },
}, { timestamps: true });

module.exports = mongoose.model("movie_list", listSchema);