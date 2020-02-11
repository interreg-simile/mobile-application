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
