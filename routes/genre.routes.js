const express = require("express");
const router = express.Router();
const genresController = require("../controllers/genre.controller");

// Define the routes
router.get("/", genresController.findAllGenres);

module.exports = router; // Export the router object
