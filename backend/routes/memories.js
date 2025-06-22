// routes/memories.js
const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');

const TokenAuth = require('../middleware/auth');

const PAGE_LIMIT = 10; // Default limit for pagination (no magic number)

// GET all
// router.get('/', async (req, res) => {
//   const memories = await Memory.find().sort({ occurredAt: -1 });
//   res.json(memories);
// });


// GET by userId with pagination (default: 10 per page)
router.get('/user/:userId',  async (req, res) => {
  const pageoffset = parseInt(req.query.page) || 0; // Default to page 0
  const limit = PAGE_LIMIT; // Default limit per page
  const skip = pageoffset * limit;

  const memories = await Memory.find({ userId: req.params.userId })
    .sort({ occurredAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Memory.countDocuments({ userId: req.params.userId });
  const totalPages = Math.ceil(totalCount / limit);

  res.json({
    memories,
    page,
    totalPages,
    totalCount,
  });
});

// POST new
router.post('/', TokenAuth, async (req, res) => {


  const { title, description, mood, intensity, occurredAt, imageUrl, location, userId } = req.body;

    // 檢查 token 中的 userId 是否與傳入的 userId 相符
    if (req.userId !== userId) {
      return res.status(401).json({ error: "Unauthorized: userId does not match token" });
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
        userId
      });
  
      await memory.save();
      res.status(201).json(memory);
    } catch (err) {
      res.status(500).json({ error: "Failed to create memory" });
    }
  });

// GET by uuid
router.get('/:uuid', async (req, res) => {
  const memory = await Memory.findOne({ uuid: req.params.uuid });
  if (!memory) return res.status(404).json({ error: 'Not found' });
  res.json(memory);
});

// PUT by uuid（僅允許原 user 編輯）
router.put('/:uuid', TokenAuth, async (req, res) => {
  const memory = await Memory.findOne({ uuid: req.params.uuid });

  if (!memory) return res.status(404).json({ error: 'Not found' });

  // 檢查是否為該使用者
  if (memory.userId.toString() !== req.userId) {
    return res.status(401).json({ error: 'Unauthorized: cannot edit others\' memory' });
  }

  Object.assign(memory, req.body);
  await memory.save();
  res.json(memory);
});

// DELETE by uuid（僅允許原 user 刪除）
router.delete('/:uuid', TokenAuth, async (req, res) => {
  const memory = await Memory.findOne({ uuid: req.params.uuid });

  if (!memory) return res.status(404).json({ error: 'Not found' });

  // 檢查是否為該使用者
  if (memory.userId.toString() !== req.userId) {
    return res.status(401).json({ error: 'Unauthorized: cannot delete others\' memory' });
  }

  await memory.deleteOne();
  res.sendStatus(204);
});

module.exports = router;
