const mongoose = require("mongoose");

const showsSchema = new mongoose.Schema(
  {
    theater: { type: String, required: true },
    language: { type: String, required: true },
    show_timing: {
      type: Date,
      required: true,
    },
    available_seats: {
      type: Number,
      required: true,
      min: 0,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    movieId: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = showsSchema;
