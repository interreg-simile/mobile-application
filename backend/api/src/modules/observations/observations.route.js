import { Router } from "express";

import * as validator from "./observations.validator";
import * as controller from "./observations.controller";
import { vPath } from "../../utils/common-validations";


// Create a router object
const router = Router();

// GET - /observations/
router.get("/", validator.getAllQuery, controller.getAll);

// POST - /observations/
// router.post("/", validator.observation, controller.create);
router.post("/", controller.create);

// GET - /observations/{obs_id}
router.get("/:id", vPath.id, controller.getById);

// DELETE - /observations/{obs_id}
router.delete("/:id", vPath.id, controller.markForDeletion);

// PUT - /events/{event_id}
// router.put("/:id", vPath.id, validator.event, controller.update);

// PATCH - /events/{event_id}
// router.patch("/:id", vPath.id, validator.patch, controller.patch);

// Export the router
export default router;
