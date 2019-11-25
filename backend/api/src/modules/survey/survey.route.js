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

// PUT - /survey/{survey_id}
router.put("/:surveyId", validator.all, controller.update);

// PATCH - /survey/{survey_id}
router.patch("/:surveyId", validator.userAnswer, controller.addUserAnswer);

// Export the router
export default router;
