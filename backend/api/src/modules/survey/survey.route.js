import { Router } from "express";

import * as controller from "./survey.controller";

// Create a router object
const router = Router();

/*
 * GET - /survey/get-all
 * Query params:
 *      - expired: true|false (default = true)
 *      - answers: all|curr|none (default = none) [all only admin, curr only if logged]
 */
router.get("/get-all", controller.getAll);

// Export the router
export default router;
