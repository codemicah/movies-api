const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema(
    {
        title: {
            type: String
        },
        year: {
            type: String
        },
        genre: {
            type: String
        },
        rating: {
            type: Number
        },
        list_ref_id: {
            type: Schema.Types.ObjectId,
            ref: "movie_list"
        },
        user_ref_id: { type: Schema.Types.ObjectId, ref: "user" }
    }, { timestamps: true}
);

module.exports = mongoose.model("movie", movieSchema);