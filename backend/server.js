import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectToMongoDB from "./config/db/connectToMongoDB.js";

// API Routes
import userRoutes from "./routes/user.routes.js";
import newsRoutes from "./routes/news.routes.js";
import courseRoutes from "./routes/course.routes.js";
import competitionRoutes from "./routes/competition.routes.js";
import adsRoutes from "./routes/ads.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { getAdminAnalytics } from "./controllers/getAdminAnalytics.controller.js";
import { superAdminOnly, adminOnly, protect } from "./middleware/authMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = ["http://localhost:5173"]; // Allowed frontend origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Enfover API");
});

// Connect to MongoDB
connectToMongoDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", protect, adminOnly, getAdminAnalytics);

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (Uploads directory)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
