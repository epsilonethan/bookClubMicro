const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendation.controller");

router.get("/", recommendationController.getRecommendations);
router.post("/", recommendationController.addRecommendation);
router.delete("/", recommendationController.deleteRecommendation);

module.exports = router;
