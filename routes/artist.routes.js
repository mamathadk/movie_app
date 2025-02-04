const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artist.controller");

// Define the routes
router.get("/", artistsController.findAllArtists);

module.exports = router; // Export the router object
