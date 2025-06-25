const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');
const TokenAuth = require('../middleware/auth');

const PAGE_LIMIT = 10;

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

  Object.assign(memory, req.body);
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
