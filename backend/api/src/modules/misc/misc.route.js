/**
 * @fileoverview This file defines miscellaneous endpoints to accomplish various utility stuff.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { Router } from "express";
import * as validator from "./misc.validator";
import * as controller from "./misc.controller";


// Create a router object
const router = Router();

// GET - misc/weather
router.get("/weather", validator.weather, controller.getWeather);

// Export the router
export default router;
