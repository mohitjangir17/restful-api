const express = require("express");
const router = express.Router();
const { checkUser } = require("../authentication/auth");

router.get("/", checkUser, (req, res) => {
  res.render("index");
});

module.exports = router;
