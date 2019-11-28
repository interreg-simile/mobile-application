import { Router } from "express";

import * as validator from "./event.validator";
import * as controller from "./event.controller";

// Create a router object
const router = Router();

// GET - /event
router.get("/", controller.getAll);

// POST - /event
router.post("/", controller.create);

// GET - /event/{event_id}
router.get("/:surveyId", controller.getById);

// DELETE - /event/{event_id}
router.delete("/:surveyId", controller.markForDeletion);

// PUT - /event/{event_id}
router.put("/:surveyId", controller.update);

// PATCH - /event/{event_id}
router.patch("/:surveyId", controller.addParticipants);

// Export the router
export default router;
