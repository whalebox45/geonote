const express = require('express');
const router = express.Router();
const UserProfile = require('../models/user_profile');
const TokenAuth = require('../middleware/auth');

// 取得單一用戶（公開）
router.get('/:uuid', async (req, res) => {
  const user = await UserProfile.findOne({ uuid: req.params.uuid });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// 編輯用戶（僅限本人）
router.patch('/:uuid', TokenAuth, async (req, res) => {
  if (req.params.uuid !== req.userUuid) {
    return res.status(401).json({ error: 'Unauthorized: cannot edit others\' profile' });
  }

  const user = await UserProfile.findOneAndUpdate(
    { uuid: req.params.uuid },
    req.body,
    { new: true }
  );

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user);
});

// 停用用戶（僅限本人，改設 isRevoked 為 true）
router.delete('/:uuid', TokenAuth, async (req, res) => {
  if (req.params.uuid !== req.userUuid) {
    return res.status(401).json({ error: 'Unauthorized: cannot revoke others\' account' });
  }

  const user = await UserProfile.findOneAndUpdate(
    { uuid: req.params.uuid },
    { isRevoked: true },
    { new: true }
  );

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.sendStatus(204);
});

module.exports = router;
