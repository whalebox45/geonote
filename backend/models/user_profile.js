// models/UserProfile.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserProfileSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  nickname: String,
  bio: String,
  avatarUrl: String,
  roles: {
    type: [String],
    default: ["user"]
  },
  isTestAccount: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
