// models/Memory.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const MemorySchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        default: uuidv4
    },
    userUuid: {
        type: String,
        required: true
    },
    title: String,
    description: String,
    mood: String,                // ex: "開心", "悲傷"
    intensity: Number,           // 1-5
    occurredAt: Date,
    imageUrl: String,            // 圖片上傳之後的連結
    location: {
        lat: Number,
        lng: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 建立複合唯一索引（userId + uuid）
MemorySchema.index({ userUuid: 1, uuid: 1 }, { unique: true });

module.exports = mongoose.model("Memory", MemorySchema);
