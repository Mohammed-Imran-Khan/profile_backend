import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGO_DB_STRING;

const dbConnection = async () => {
    try {

        const connection = await mongoose.connect(connectionString)

        console.log("MongoDB connected successfully");
        return connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

    }
};

export default dbConnection;
