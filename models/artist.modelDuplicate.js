const mongoose = require("mongoose");

// Define the Artist schema
const { Schema } = mongoose;

const artistSchemaDuplicate = new Schema({
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
  ], // Reference to Movie
});

const Artist = mongoose.model("Artist", artistSchemaDuplicate);
module.exports = Artist;
//module.exports = artistSchema;
