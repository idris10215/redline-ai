import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const port = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();