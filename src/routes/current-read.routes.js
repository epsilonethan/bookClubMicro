const express = require("express");
const router = express.Router();
const currentReadController = require("../controllers/current-read.controller");

router.get("/", currentReadController.getCurrentRead);
router.put("/mark-finished", currentReadController.markCurrentReadFinished);
router.put("/set", currentReadController.setCurrentRead);
router.put("/unset", currentReadController.removeCurrentRead)

module.exports = router;
