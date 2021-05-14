const { Schema, model } = require("mongoose");

const listSchema = new Schema(
  {
    name: { type: String, required: true },
    user_ref_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

module.exports = model("movie_list", listSchema);
