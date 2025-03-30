const pool = require("../config/database");
const logger = require("../utils/logger");
const queries = require("../db/queries");
const moment = require("moment-timezone");

exports.getCurrentRead = async (req, res) => {
    try {
        const { rows } = await pool.query(queries.GET_CURRENT_READ);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Current read is not set" });
        }

        res.json(rows[0]);
    } catch (error) {
        logger.error(`Database Error: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.setCurrentRead = async (req, res) => {
    try {
        const { currentReadRows } = await pool.query(queries.GET_CURRENT_READ);
        const { bookId } = req.query;

        if (currentReadRows.length === 1) {
            return res.status(404).json({ message: "Current read is not set" });
        } else if (currentReadRows.length === 0 ) {
            const date = moment().tz('America/Chicago').format('YYY-MM-DD');
            await pool.query(queries.SET_CURRENT_READ, [date, bookId])
        }
    } catch (error) {
        logger.error(`Database Error: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.removeCurrentRead = async (req, res) => {
    try {
        const { currentReadRows } = await pool.query(queries.GET_CURRENT_READ);

        if (currentReadRows.length === 0) {
            return res.status(404).json({ message: "Current read is not set" });
        } else if (currentReadRows.length === 1) {
            await pool.query(queries.UNSET_CURRENT_READ, [currentReadRows[0].id]);
        }
    } catch (error) {
        logger.error(`Database Error: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.markCurrentReadFinished = async (req, res) => {
    try {
        const { currentReadRows } = await pool.query(queries.GET_CURRENT_READ);
        const date = moment.tz('America/Chicago').format('YYY-MM-DD');

        if (currentReadRows.length === 1) {
            await pool.query(queries.MARK_CURRENT_READ_FINISHED, [date]);
        } else {
            return res.status(404).json({ message: "Current read is not set" });
        }
    } catch (error) {
        logger.error(`Database Error: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}