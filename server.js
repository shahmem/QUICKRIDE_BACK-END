const express = require("express");
const path = require('path');
const connectDB = require('./db'); // Import MongoDB connection
connectDB();

const cors = require("cors");
require("dotenv").config();

const signupRoutes = require("./routes/signup");
const loginRoutes = require("./routes/login");
const authRoutes = require("./routes/auth");
const driverprofileRoutes = require("./routes/driverprofile");
const riderprofileRoutes = require("./routes/riderprofile");
const bookings = require("./routes/bookform");
const adminAuthRoutes = require("./routes/admin");

const app = express();
// app.use((req, res, next) => {
//   console.log(`[INCOMING] ${req.method} ${req.originalUrl}`);
//   next();
// });

// Middleware
app.use(cors({
  origin: "https://quick-ride-dun.vercel.app", // Your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true // If you're using cookies, auth headers, etc.
})); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/forgot-password", authRoutes);
app.use("/api/driverprofile", driverprofileRoutes);
app.use("/api/riderprofile", riderprofileRoutes);
app.use("/api/bookings", bookings);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
