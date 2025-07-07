import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api/users", authRoutes);;

connectDB();

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
