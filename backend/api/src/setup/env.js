/**
 * @fileoverview This file imports the environmental variables to expose them in a more readable way.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import dotenv from "dotenv";


// Import the environmental variables
dotenv.config();

// Export the variables in a readable way
export const MONGO_URL        = process.env.MONGO_URL;
export const JWT_PK           = process.env.JWT_PK;
export const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
export const EMAIL_ADDRESS    = process.env.EMAIL_ADDRESS;
export const EMAIL_HOST       = process.env.EMAIL_HOST;
export const EMAIL_PORT       = process.env.EMAIL_PORT;
export const EMAIL_USERNAME   = process.env.EMAIL_USERNAME;
export const EMAIL_PASSWORD   = process.env.EMAIL_PASSWORD;
