// routes/auth.js
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user_profile");
const Account = require("../models/account");



// 註冊
router.post("/register", async (req, res) => {
    const { email, password, nickname, bio } = req.body;
  
    try {
      // 檢查是否已有帳號
      const existing = await Account.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }
  
      // 建立 user profile
      const user = await User.create({ nickname, bio });
  
      // 建立帳號（userId 連到 ObjectId，而非 uuid）
      const passwordHash = await bcrypt.hash(password, 10);
      const account = await Account.create({
        userId: user._id,
        email,
        passwordHash
      });
  
      // 自動登入：產生 token
      const token = jwt.sign(
        { userId: account.userId, provider: account.provider },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.status(201).json({ token, userId: user.uuid });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt:", { email, password });

    const account = await Account.findOne({ email });
    if (!account) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { userId: account.userId, provider: account.provider },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token });
});

module.exports = router;
