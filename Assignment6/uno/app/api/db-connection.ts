import mongoose from "mongoose";
import { isError } from "../models/utils";

const MONGO_URI = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://127.0.0.1:27017/test";

/**
 * Connects to mongoose
 * @returns Mongoose default connection or nothing on error
 */
export async function connectToDatabase(): Promise<mongoose.Connection | undefined> {
    // Connect to MongoDB
    try {
        const connection = await mongoose.connect(MONGO_URI)//{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Connection established to database! ")
        return connection.connection
    } catch (err) {
        if (isError(err))
            console.error("Error connecting to database! ", err.message)
        return undefined
    }
}