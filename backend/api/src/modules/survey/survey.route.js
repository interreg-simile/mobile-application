import { Router } from "express";

import * as validator from "./survey.validator";
import { idValidation } from "../utils/common-validations";
import * as controller from "./survey.controller";

// Create a router object
const router = Router();

// GET - /survey
router.get("/", controller.getAll);

// POST - /survey
router.post("/", validator.all, controller.create);

// GET - /survey/user/{user_id}
router.get("/user/:id", idValidation, controller.getByUser);

// GET - /survey/{survey_id}
router.get("/:id", idValidation, controller.getById);

// DELETE - /survey/{survey_id}
router.delete("/:id", idValidation, controller.markForDeletion);

// PUT - /survey/{survey_id}
router.put("/:id", idValidation, validator.all, controller.update);

// PATCH - /survey/{survey_id}
router.patch("/:id", idValidation, validator.userAnswer, controller.addUserAnswer);

// Export the router
export default router;
