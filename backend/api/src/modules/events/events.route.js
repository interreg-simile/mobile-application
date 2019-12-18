import { Router } from "express";

import * as validator from "./events.validator";
import { vPath } from "../../utils/common-validations";
import * as controller from "./events.controller";


// Create a router object
const router = Router();

// GET - /events/
router.get("/", validator.getAllQuery, controller.getAll);

// POST - /events/
router.post("/", validator.event, controller.create);

// GET - /events/{event_id}
router.get("/:id", vPath.id, controller.getById);

// DELETE - /events/{event_id}
router.delete("/:id", vPath.id, controller.markForDeletion);

// PUT - /events/{event_id}
router.put("/:id", vPath.id, validator.event, controller.update);

// PATCH - /events/{event_id}
router.patch("/:id", vPath.id, validator.participants, controller.addParticipants);

// Export the router
export default router;
