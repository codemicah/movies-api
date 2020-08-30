const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: { type: String },
    movies:[
        { type: Schema.Types.ObjectId, ref: "movie" }
    ]
}, { timestamps: true });

module.exports = mongoose.model("movie_list", listSchema);