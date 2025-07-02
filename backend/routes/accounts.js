// routes/accounts.js
const express = require('express')
const router = express.Router()
const Account = require('../models/account')
const UserProfile = require('../models/user_profile')

router.get('/by-uuid/:uuid', async (req, res) => {
  const user = await UserProfile.findOne({ uuid: req.params.uuid })
  if (!user) return res.status(404).json({ error: 'User not found' })

  const account = await Account.findOne({ userId: user._id })
  if (!account) return res.status(404).json({ error: 'Account not found' })

  res.json({ email: account.email })
})

module.exports = router
