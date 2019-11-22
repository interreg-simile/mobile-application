import { Router } from "express";

import * as validator from "./survey.validator";
import * as controller from "./survey.controller";

// Create a router object
const router = Router();

// GET - /survey
router.get("/", controller.getAll);

// POST - /survey
router.post("/", validator.all, controller.create);

// GET - /survey/user/{user_id}
router.get("/user/:userId", controller.getByUser);

// GET - /survey/{survey_id}
router.get("/:surveyId", controller.getById);

// DELETE - /survey/{survey_id}
router.delete("/:surveyId", controller.markForDeletion);

// PATCH - /survey/{survey_id}/general-info
router.put("/:surveyId", controller.updateGeneralInfo);

// PATCH - /survey/{survey_id}/user-answer
router.patch("/:surveyId/user-answer", controller.addUserAnswer);

// Export the router
export default router;
