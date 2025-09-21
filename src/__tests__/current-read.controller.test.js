const currentReadController = require('../controllers/current-read.controller');

// Mock dependencies
jest.mock('../config/database');
jest.mock('../utils/logger');
jest.mock('../db/queries');
jest.mock('moment-timezone');

const pool = require('../config/database');
const { logger } = require('../utils/logger');
const queries = require('../db/queries');
const moment = require('moment-timezone');

describe('Current Read Controller', () => {
    let req, res;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock request and response objects
        req = {
            query: {},
            params: {},
            body: {}
        };

        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };

        // Default moment mock
        const mockTz = jest.fn().mockReturnValue({
            format: jest.fn().mockReturnValue('2024-03-30')
        });
        moment.mockReturnValue({
            tz: mockTz
        });
        moment.tz = jest.fn().mockReturnValue({
            format: jest.fn().mockReturnValue('2024-03-30')
        });
    });

    describe('getCurrentRead', () => {
        it('should return current read when one exists', async () => {
            const mockCurrentRead = { id: 1, title: 'Test Book', author: 'Test Author' };
            pool.query.mockResolvedValue({ rows: [mockCurrentRead] });

            await currentReadController.getCurrentRead(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(res.json).toHaveBeenCalledWith(mockCurrentRead);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should return 404 when no current read is set', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            await currentReadController.getCurrentRead(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Current read is not set" });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database connection failed');
            pool.query.mockRejectedValue(error);

            await currentReadController.getCurrentRead(req, res);

            expect(logger.error).toHaveBeenCalledWith(`Database Error: ${error.message}`);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });

    describe('setCurrentRead', () => {
        beforeEach(() => {
            req.query.bookId = '123';
        });

        it('should set current read when none exists', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] }); // No current read
            pool.query.mockResolvedValueOnce({}); // Set current read

            await currentReadController.setCurrentRead(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(pool.query).toHaveBeenCalledWith(queries.SET_CURRENT_READ, ['2024-03-30', '123']);
        });

        it('should return 404 when current read already exists', async () => {
            pool.query.mockResolvedValue({ rows: [{ id: 1 }] }); // Current read exists

            await currentReadController.setCurrentRead(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Current read is not set" });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database connection failed');
            pool.query.mockRejectedValue(error);

            await currentReadController.setCurrentRead(req, res);

            expect(logger.error).toHaveBeenCalledWith(`Database Error: ${error.message}`);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });

    describe('removeCurrentRead', () => {
        it('should remove current read when one exists', async () => {
            const mockCurrentRead = { id: 1, title: 'Test Book' };
            pool.query.mockResolvedValueOnce({ rows: [mockCurrentRead] }); // Current read exists
            pool.query.mockResolvedValueOnce({}); // Remove current read

            await currentReadController.removeCurrentRead(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(pool.query).toHaveBeenCalledWith(queries.UNSET_CURRENT_READ, [mockCurrentRead.id]);
        });

        it('should return 404 when no current read exists', async () => {
            pool.query.mockResolvedValue({ rows: [] }); // No current read

            await currentReadController.removeCurrentRead(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Current read is not set" });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database connection failed');
            pool.query.mockRejectedValue(error);

            await currentReadController.removeCurrentRead(req, res);

            expect(logger.error).toHaveBeenCalledWith(`Database Error: ${error.message}`);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });

    describe('markCurrentReadFinished', () => {
        it('should mark current read as finished when one exists', async () => {
            const mockCurrentRead = { id: 1, title: 'Test Book' };
            pool.query.mockResolvedValueOnce({ rows: [mockCurrentRead] }); // Current read exists
            pool.query.mockResolvedValueOnce({}); // Mark as finished

            await currentReadController.markCurrentReadFinished(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(pool.query).toHaveBeenCalledWith(queries.MARK_CURRENT_READ_FINISHED, ['2024-03-30']);
        });

        it('should return 404 when no current read exists', async () => {
            pool.query.mockResolvedValue({ rows: [] }); // No current read

            await currentReadController.markCurrentReadFinished(req, res);

            expect(pool.query).toHaveBeenCalledWith(queries.GET_CURRENT_READ);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Current read is not set" });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database connection failed');
            pool.query.mockRejectedValue(error);

            await currentReadController.markCurrentReadFinished(req, res);

            expect(logger.error).toHaveBeenCalledWith(`Database Error: ${error.message}`);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });
});