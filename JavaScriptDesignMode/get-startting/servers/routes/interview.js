const express = require("express");
const router = express.Router();

router.get("/interview", async (req, res, next) => {
  try {
    res.send("/interview.js");
  } catch (e) {
    next(e);
  }
});

module.exports = router;
