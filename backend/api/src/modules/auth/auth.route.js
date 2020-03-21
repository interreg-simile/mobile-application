/**
 * @fileoverview This file defines the auth endpoints to access and manipulate the API keys.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { Router } from "express";

import * as validator from "./auth.validator";
import * as controller from "./auth.controller";
import { vPath } from "../../utils/common-validations";


// Create a router object
const router = Router();

// POST /auth/keys
router.post("/keys", validator.apiKey, controller.createApiKey);

// GET /auth/register
router.post("/register", controller.register);

// Export the router
export default router;
