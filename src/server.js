require("dotenv").config();
const express = require("express");
const cors = require("cors");
const currentReadRoutes = require("./routes/current-read.routes");
const readListRoutes = require("./routes/read-list.routes");
const recommendationsRoutes = require("./routes/recommendation.routes");
const { logger, requestLogger } = require("./utils/logger");

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/current-read", currentReadRoutes);
app.use("/read-list", readListRoutes);
app.use("/recommendations", recommendationsRoutes)

// Health Check
app.get("/", (req, res) => res.json({ status: "OK", message: "Book Service is running!" }));

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
