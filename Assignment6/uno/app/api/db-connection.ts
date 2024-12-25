import mongoose from "mongoose";
import { isError } from "../models/utils";

const MONGO_URI = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://127.0.0.1:27017/test";

/**
 * Connects to mongoose default connection
 */
export async function connectToDatabase() {
    // Connect to MongoDB
    try {
        await mongoose.connect(MONGO_URI)//{ useNewUrlParser: true, useUnifiedTopology: true })
        //console.log("Connection established to database! ")
    } catch (err) {
        if (isError(err))
            console.error("Error connecting to database! ", err.message)
        return
    }
}