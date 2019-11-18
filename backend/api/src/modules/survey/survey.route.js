import { Router } from "express";

import * as controller from "./survey.controller";

// Create a router object
const router = Router();

// GET - /survey/get-all
router.get("/get-all", controller.getAll);

// Export the router
export default router;
