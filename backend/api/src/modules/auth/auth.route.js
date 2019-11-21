import { Router } from "express";

import * as controller from "./auth.controller";

// Create a router object
const router = Router();

// POST /auth/api-key
router.post("/api-key", controller.generateApiKey);

// Export the router
export default router;
