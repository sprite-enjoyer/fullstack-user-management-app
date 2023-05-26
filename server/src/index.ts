import express from "express";
import dotenv from "dotenv";
import userRoutes from "./userRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const PORT = 3000;

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log("express server started! 🚀");
});