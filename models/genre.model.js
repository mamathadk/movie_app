const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  genreid: { type: Number, required: true, unique: true },
  name: { type: String, required: true, trim: true, unique: true },
});
const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
