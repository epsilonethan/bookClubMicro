const pool = require("../config/database");
const {logger} = require("../utils/logger");
const queries = require("../db/queries");
const moment = require("moment-timezone");

exports.getRecommendations = async (req, res) => {
    try {
        const {rows} = await pool.query(queries.GET_RECOMMENDATIONS);
        res.json(rows);
    } catch (error) {
        logger.error(`Database Error: ${error.message}`);
        res.status(500).json({error: "Internal Server Error"});
    }
};

exports.addRecommendation = async (req, res) => {
    const {userId, title, author, workId} = req.body;
    if (!userId || !title || !author || !workId) {
        res.status(400).json({error: "Missing required fields"});
        return;
    }

    try {
        await pool.query(queries.ADD_RECOMMENDATION, [userId, title, author, workId, moment().tz('America/Chicago').format('YYYY-MM-DD')]);
        res.status(204).json({message: 'Recommendation added successfully.'});
    } catch (error) {
        if (error.code === '23505') {
            logger.warn(`User ${userId} attempted to add a duplicate book - title ${title}`);
            res.status(400).json({error: "Cannot add a duplicate book"});
        } else {
            logger.error(error.message);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
};

exports.deleteRecommendation = async (req, res) => {
    const {bookId} = req.params;

    if (!bookId) {
        return res.status(400).json({error: "Missing required query param bookId"});
    }

    try {
        await pool.query(queries.DELETE_RECOMMENDATION, [bookId]);
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};