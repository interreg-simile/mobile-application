import dotenv from "dotenv";

// Import the environmental variables
dotenv.config();

// Export the variables in a readable way
export const MONGO_URL = process.env.MONGO_URL;
export const JWT_PK    = process.env.JWT_PK;
