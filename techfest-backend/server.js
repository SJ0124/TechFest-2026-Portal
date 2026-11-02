const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
require("dotenv").config();

const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const registrationRoutes = require("./routes/registrations");

const app = express();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many login or signup attempts. Please try again after 15 minutes."
  }
});
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://tech-fest-2026-portal.vercel.app"
  ]
}));
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ message: "TechFest 2026 API is running" });
});

app.use("/api/events", eventRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/registrations", registrationRoutes);

app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
