const Genre = require("../models/genre.model");

exports.findAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (err) {
    res.status(500).json({ message: "Error fetching genres", error: err });
  }
};
