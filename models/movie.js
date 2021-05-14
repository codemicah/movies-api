const { Schema, model } = require("mongoose");

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
    },
    rating: {
      type: Number,
    },
    list_ref_id: {
      type: Schema.Types.ObjectId,
      ref: "movie_list",
    },
    user_ref_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

module.exports = model("movie", movieSchema);
