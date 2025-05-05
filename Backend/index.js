import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();  

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

try {
    mongoose.connect(URI);
    console.log("Connected to MongoDB");
} catch (error) {
    console.log(error);
}

//routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);



// --------------- code for deployment --------------------

if (process.env.NODE_ENV === 'production') {
    const dirPath =  path.resolve();
    app.use(express.static("./Frontend/dist"));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(dirPath, './Frontend/dist','index.html'));
    });
}

server.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});