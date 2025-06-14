// routes/memories.js
const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');

const devTokenAuth = require('../middleware/devTokenAuth');

// GET all
router.get('/', async (req, res) => {
  const memories = await Memory.find().sort({ occurredAt: -1 });
  res.json(memories);
});

// POST new
router.post('/', devTokenAuth, async (req, res) => {
  const memory = new Memory(req.body);
  await memory.save();
  res.status(201).json(memory);
});

// GET by uuid
router.get('/:uuid', async (req, res) => {
  const memory = await Memory.findOne({ uuid: req.params.uuid });
  if (!memory) return res.status(404).json({ error: 'Not found' });
  res.json(memory);
});

// PUT by uuid
router.put('/:uuid', async (req, res) => {
  const memory = await Memory.findOneAndUpdate({ uuid: req.params.uuid }, req.body, { new: true });
  if (!memory) return res.status(404).json({ error: 'Not found' });
  res.json(memory);
});

// DELETE by uuid
router.delete('/:uuid', async (req, res) => {
  const result = await Memory.findOneAndDelete({ uuid: req.params.uuid });
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.sendStatus(204);
});

module.exports = router;
