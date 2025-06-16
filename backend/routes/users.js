// routes/users.js
const express = require('express');
const router = express.Router();
const UserProfile = require('../models/user_profile');

// 建立用戶
router.post('/', async (req, res) => {
  try {
    const user = new UserProfile(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 取得所有用戶
router.get('/', async (req, res) => {
  const users = await UserProfile.find().sort({ createdAt: -1 });
  res.json(users);
});

// 用 uuid 查單一用戶
router.get('/:uuid', async (req, res) => {
  const user = await UserProfile.findOne({ uuid: req.params.uuid });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// 編輯用戶
router.patch('/:uuid', async (req, res) => {
  const user = await UserProfile.findOneAndUpdate(
    { uuid: req.params.uuid },
    req.body,
    { new: true }
  );
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// 刪除用戶
router.delete('/:uuid', async (req, res) => {
  const user = await UserProfile.findOneAndDelete({ uuid: req.params.uuid });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.sendStatus(204);
});

module.exports = router;
