const express = require("express");
const router = express.Router();
const bookController = require("../controllers/read-list.controller");

router.get("/", bookController.readList);

module.exports = router;
