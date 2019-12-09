import { Router } from "express";

import * as validator from "./events.validator";
import { p } from "../../utils/common-validations";
import * as controller from "./events.controller";


// Create a router object
const router = Router();

// GET - /events/
router.get("/", validator.getAllQuery, controller.getAll);

// POST - /events/
router.post("/", validator.event, controller.create);

// GET - /events/{event_id}
router.get("/:id", p.id, controller.getById);

// DELETE - /events/{event_id}
router.delete("/:id", p.id, controller.markForDeletion);

// PUT - /events/{event_id}
router.put("/:id", p.id, validator.event, controller.update);

// PATCH - /events/{event_id}
router.patch("/:id", p.id, validator.participants, controller.addParticipants);

// Export the router
export default router;
