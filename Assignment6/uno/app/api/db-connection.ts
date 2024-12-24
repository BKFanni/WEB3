import mongoose from "mongoose";
import { isError } from "../models/utils";

const MONGO_URI = process.env.MONGO_URI ? process.env.MONGO_URI : "idk";

/**
 * Connects to mongoose
 * @returns Mongoose connection or nothing on error
 */
export async function connectToDatabase(): Promise<mongoose.Mongoose | undefined> {
    // Connect to MongoDB
    try {
        const connection = await mongoose.connect(MONGO_URI, {})//{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Connection established to database! ")
        return connection
    } catch (err) {
        if (isError(err))
            console.error("Error connecting to database! ", err.message)
        return undefined
    }
}