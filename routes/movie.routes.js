const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movie.controller");

// Define the routes
router.get("/movies", moviesController.findAllMovies);
router.get("/movies/:movieId", moviesController.findOne);
router.get("/movies/:movieId/shows", moviesController.findShows);

module.exports = router; // Export the router object
