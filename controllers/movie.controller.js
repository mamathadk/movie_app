const Movie = require("../models/movie.model");
const ArtistDuplicate = require("../models/artist.modelDuplicate");
exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: "Error creating movie", error: err });
  }
};

exports.findAllMovies = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { status, title, genres, artists, start_date, end_date } = req.query;
    let movies;
    let query = {};

    if (status) {
      if (status === "PUBLISHED") {
        query.published = true;
        movies = await Movie.find({ published: true });
      } else if (status === "RELEASED") {
        query.released = true;
        movies = await Movie.find({ released: true });
      } else {
        return res.status(400).json({
          message:
            "Invalid status parameter. Allowed values: PUBLISHED, RELEASED.",
        });
      }
    }

    // Handle 'title' query parameter
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    // Handle 'genres' query parameter (assuming genres is a comma-separated list of genres)
    if (genres) {
      query.genres = { $in: genres.split(",").map((genre) => genre.trim()) };
    }

    // Handle 'artists' query parameter (assuming artists is a comma-separated list)
    if (artists) {
      const arti = await ArtistDuplicate.find();

      const firstNames = arti.map((artist) => artist.first_name);

      console.log("firstNames", firstNames);
      query = {
        "artists.first_name": { $in: artists },
      };
    }

    // Handle 'start_date' and 'end_date' query parameters
    if (start_date || end_date) {
      query.release_date = {};

      if (start_date) {
        query.release_date.$gte = new Date(start_date); // Start date (greater than or equal to)
      }
      if (end_date) {
        query.release_date.$lte = new Date(end_date); // End date (less than or equal to)
      }
    }
    // movies = await Movie.find(query);

    // Fetch the movies from the database using the dynamic query
    movies = await Movie.find(query);
    // Return the filtered movies
    res.json({ movies: movies });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ message: "Error fetching movies", error: err });
  }
};

exports.findOne = async (req, res) => {
  try {
    // Get the movieId from the request parameters
    const { movieId } = req.params;
    //console.log("Fetching movie with ID:", movieId);

    const movie = await Movie.findOne({ movieid: movieId });
    // Check if the movie exists
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Return the movie details
    res.json(movie);
  } catch (err) {
    console.error("Error fetching movie by ID:", err);
    res.status(500).json({ message: "Error fetching movie", error: err });
  }
};
exports.findShows = async (req, res) => {
  try {
    const { movieId } = req.params; // Get movieId from the route parameters
    if (!movieId) {
      return res.status(400).json({ message: "Invalid movie ID format." });
    }
    const movie = await Movie.findOne({ movieid: movieId });

    if (!movie) {
      return res.status(400).json({ message: " movie not found." });
    }

    res.json(movie.shows);
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ message: "Error fetching shows", error: err });
  }
};
