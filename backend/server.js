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
import adsRoutes from "./routes/ads.routes.js"
import paymentRoutes from "./routes/payment.routes.js";


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(morgan("dev")); // Log HTTP requests

// Connect to MongoDB
connectToMongoDB();


app.use("/api/users", userRoutes); // User routes for authentication and profile
app.use("/api/news", newsRoutes); // News section routes
app.use("/api/courses", courseRoutes); // Courses section routes
app.use("/api/competitions", competitionRoutes); // Competition routes
app.use("/api/ads", adsRoutes); // Ads routes
app.use("/api/payments", paymentRoutes); //payment routes



// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Static Files (For production builds)


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
//   });
// }


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
