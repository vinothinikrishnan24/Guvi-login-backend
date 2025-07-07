import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
}));

app.use(express.json());

app.use("/api/users", authRoutes);;

connectDB();

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
