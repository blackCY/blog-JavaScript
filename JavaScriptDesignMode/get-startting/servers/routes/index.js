const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    console.log(111)
    await res.render("/index.html");
  } catch (e) {
    next(e);
  }
});

module.exports = router;
