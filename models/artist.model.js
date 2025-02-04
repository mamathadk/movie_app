const mongoose = require("mongoose");
const { Schema } = mongoose;
const artistSchema = new Schema({
  artistid: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  wiki_url: { type: String, required: true },
  profile_url: { type: String, required: true },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});
module.exports = artistSchema;
//module.exports = mongoose.model("Artist", artistSchema);
