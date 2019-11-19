import { Router } from "express";

import * as controller from "./user.controller";

// Create a router object
const router = Router();

// GET - /user/get-test
router.get("/get-test", controller.getTest);

// Export the router
export default router;
