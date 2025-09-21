const pool = require("../config/database");
const {logger} = require("../utils/logger");
const queries = require("../db/queries");

exports.readList = async (req, res) => {
    try {
        const { rows } = await pool.query(queries.ALL_READ_BOOKS);
        res.json(rows);
    } catch (error) {
        logger.error(`Database Error: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};