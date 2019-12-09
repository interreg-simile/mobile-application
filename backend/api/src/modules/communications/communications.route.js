import { Router } from "express";

import * as validator from "./communications.validator";
import { p } from "../../utils/common-validations";
import * as controller from "./communications.controller";


// Create a router object
const router = Router();

// GET - /communications
router.get("/", validator.getAllQuery, controller.getAll);

// POST - /communications
router.post("/", validator.communication, controller.create);

// GET - /communications/{communication_id}
router.get("/:id", p.id, controller.getById);

// DELETE - /communications/{communication_id}
router.delete("/:id", p.id, controller.markForDeletion);

// PUT - /communications/{communication_id}
router.put("/:id", p.id, validator.communication, controller.update);

// Export the router
export default router;
