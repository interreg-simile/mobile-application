import { Router } from "express";

import * as validator from "./alerts.validator";
import { p } from "../../utils/common-validations";
import * as controller from "./alerts.controller";


// Create a router object
const router = Router();

// GET - /alerts
router.get("/", validator.getAllQuery, controller.getAll);

// POST - /alerts
router.post("/", validator.alert, controller.create);

// GET - /alerts/{alert_id}
router.get("/:id", p.id, controller.getById);

// DELETE - /alerts/{alert_id}
router.delete("/:id", p.id, controller.markForDeletion);

// PUT - /alerts/{alert_id}
router.put("/:id", p.id, validator.alert, controller.update);

// Export the router
export default router;
