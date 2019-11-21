import { Router } from "express";

import * as controller from "./survey.controller";

// Create a router object
const router = Router();

// GET - /survey
router.get("/", controller.getAll);

// GET - /survey/user/{user_id}
router.get("/user/:userId", controller.getByUser);

// GET - /survey/{survey_id}
router.get("/:surveyId", controller.getById);

// Export the router
export default router;
