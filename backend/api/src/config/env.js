import dotenv from "dotenv";

// Import the environmental variables
dotenv.config();

// Export the variables in a readable way
export const NODE_ENV  = process.env.NODE_ENV;
export const PORT      = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL;
export const JWT_PK    = process.env.JWT_PK;
