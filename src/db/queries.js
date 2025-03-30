module.exports = {
    GET_CURRENT_READ: "SELECT * FROM bookclub.books WHERE read_end IS NULL AND read_start IS NOT NULL",
    SET_CURRENT_READ: "UPDATE bookclub.books SET read_start = ($1) WHERE id = ($2)",
    UNSET_CURRENT_READ: "UPDATE bookclub.books SET read_start = NULL WHERE id = ($1)",
    MARK_CURRENT_READ_FINISHED: "UPDATE bookclub.books SET read_end = ($1) WHERE read_start IS NOT NULL AND read_end IS NULL",
    ALL_READ_BOOKS: "SELECT * FROM bookclub.books WHERE read_start IS NOT NULL AND read_end IS NOT NULL ORDER BY read_end",
    GET_RECOMMENDATIONS: "SELECT * FROM bookclub.books WHERE read_start IS NULL AND read_end IS NULL ORDER BY id",
    ADD_RECOMMENDATION: "INSERT INTO bookclub.books (added_by, title, author, work_id, added_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    DELETE_RECOMMENDATION: "DELETE FROM bookclub.books WHERE id = ($1)"
}