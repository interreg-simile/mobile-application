import { Router } from "express";

import * as validator from "./surveys.validator";
import { p } from "../../utils/common-validations";
import * as controller from "./surveys.controller";

// Create a router object
const router = Router();

// GET - /survey
router.get("/", controller.getAll);

// POST - /survey
router.post("/", validator.all, controller.create);

// GET - /survey/user/{user_id}
router.get("/user/:id", p.id, controller.getByUser);

// GET - /survey/{survey_id}
router.get("/:id", p.id, controller.getById);

// DELETE - /survey/{survey_id}
router.delete("/:id", p.id, controller.markForDeletion);

// PUT - /survey/{survey_id}
router.put("/:id", p.id, validator.all, controller.update);

// PATCH - /survey/{survey_id}
router.patch("/:id", p.id, validator.userAnswer, controller.addUserAnswer);

// Export the router
export default router;
