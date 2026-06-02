const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');
const TokenAuth = require('../middleware/auth');

const PAGE_LIMIT = 10;

const VALID_MOODS = ['', 'joy', 'sad', 'mad', 'shook'];

function validateMemoryFields({ location, intensity, occurredAt, mood } = {}) {
  if (location !== undefined && location !== null) {
    if (
      typeof location !== 'object' ||
      typeof location.lat !== 'number' ||
      typeof location.lng !== 'number'
    ) {
      return 'Invalid location format. Expected { lat: number, lng: number }';
    }
  }
  if (intensity !== undefined && intensity !== '' && intensity !== 0) {
    const n = Number(intensity);
    if (!Number.isInteger(n) || n < 1 || n > 3) {
      return 'Intensity must be 1, 2, or 3';
    }
  }
  if (occurredAt !== undefined && isNaN(Date.parse(occurredAt))) {
    return 'Invalid occurredAt: must be a valid ISO date';
  }
  if (mood !== undefined && !VALID_MOODS.includes(mood)) {
    return `Invalid mood. Allowed values: ${VALID_MOODS.filter(Boolean).join(', ')}`;
  }
  return null;
}

// GET memories by token's corresponding userUuid
router.get('/me', TokenAuth, async (req, res) => {

  const pageoffset = parseInt(req.query.page) || 0;
  const limit = PAGE_LIMIT;
  const skip = pageoffset * limit;

  const memories = await Memory.find({ userUuid: req.userUuid })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Memory.countDocuments({ userUuid: req.userUuid });
  const totalPages = Math.ceil(totalCount / limit);

  res.json({
    memories,
    page: pageoffset,
    totalPages,
    totalCount,
  });
});

// POST new memory
router.post('/', TokenAuth, async (req, res) => {
  const {
    title,
    description,
    mood,
    intensity,
    occurredAt, // 改為前後端統一名稱
    imageUrl,
    location,
    locationName
  } = req.body;

  if (!title || !description || !occurredAt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const validationError = validateMemoryFields({ location, intensity, occurredAt, mood });
  if (validationError) return res.status(400).json({ error: validationError });

  try {

    const memory = new Memory({
      title,
      description,
      mood,
      intensity,
      occurredAt,
      imageUrl,
      location,
      locationName,
      userUuid: req.userUuid,
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (err) {
    console.error('Error creating memory:', err);
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// GET memory by uuid
router.get('/:uuid', async (req, res) => {
  const memory = await Memory.findOne({ uuid: req.params.uuid });
  if (!memory) return res.status(404).json({ error: 'Not found' });
  res.json(memory);
});

// PUT memory (only self)
router.put('/:uuid', TokenAuth, async (req, res) => {
  const memory = await Memory.findOne({ uuid: req.params.uuid });
  if (!memory) return res.status(404).json({ error: 'Not found' });

  if (memory.userUuid !== req.userUuid) {
    return res.status(401).json({ error: 'Unauthorized: cannot edit others\' memory' });
  }

  const { title, description, mood, intensity, occurredAt, imageUrl, location, locationName } = req.body;
  const validationError = validateMemoryFields({ location, intensity, occurredAt, mood });
  if (validationError) return res.status(400).json({ error: validationError });
  if (title !== undefined) memory.title = title;
  if (description !== undefined) memory.description = description;
  if (mood !== undefined) memory.mood = mood;
  if (intensity !== undefined) memory.intensity = intensity;
  if (occurredAt !== undefined) memory.occurredAt = occurredAt;
  if (imageUrl !== undefined) memory.imageUrl = imageUrl;
  if (location !== undefined) memory.location = location;
  if (locationName !== undefined) memory.locationName = locationName;
  await memory.save();
  res.json(memory);
});

// DELETE memory (only self)
router.delete('/:uuid', TokenAuth, async (req, res) => {
  const memory = await Memory.findOne({ uuid: req.params.uuid });
  if (!memory) return res.status(404).json({ error: 'Not found' });

  if (memory.userUuid !== req.userUuid) {
    return res.status(401).json({ error: 'Unauthorized: cannot delete others\' memory' });
  }

  await memory.deleteOne();
  res.sendStatus(204);
});

module.exports = router;
