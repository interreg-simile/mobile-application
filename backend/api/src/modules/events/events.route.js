import { Router } from "express";

import * as validator from "./events.validator";
import { idValidation } from "../../utils/common-validations";
import * as controller from "./events.controller";


// Create a router object
const router = Router();

// GET - /event
router.get("/", validator.getAllQuery, controller.getAll);

// POST - /event
router.post("/", validator.event, controller.create);

// GET - /event/{event_id}
router.get("/:id", idValidation, controller.getById);

// DELETE - /event/{event_id}
router.delete("/:id", idValidation, controller.markForDeletion);

// PUT - /event/{event_id}
router.put("/:id", idValidation, validator.event, controller.update);

// PATCH - /event/{event_id}
router.patch("/:id", idValidation, validator.participants, controller.addParticipants);

// Export the router
export default router;
