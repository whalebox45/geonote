const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const MemorySchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  title: String,
  description: String,
  mood: String,                // ex: "開心", "悲傷"
  intensity: Number,           // 1-5
  occurredAt: Date,
  imageUrl: String,
  location: {
    lat: Number,
    lng: Number,
  },
  userUuid: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Memory", MemorySchema);
