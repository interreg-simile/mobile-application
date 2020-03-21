/**
 * @fileoverview This file defines the alerts endpoints to access and manipulate the alerts.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { Router } from "express";

import * as validator from "./alerts.validator";
import { vPath } from "../../utils/common-validations";
import * as controller from "./alerts.controller";


// Create a router object
const router = Router();

// GET - /alerts
router.get("", validator.getAllQuery, controller.getAll);

// POST - /alerts
router.post("", validator.alert, controller.create);

// GET - /alerts/{alert_id}
router.get("/:id", vPath.id, controller.getById);

// DELETE - /alerts/{alert_id}
router.delete("/:id", vPath.id, controller.markForDeletion);

// PUT - /alerts/{alert_id}
router.put("/:id", vPath.id, validator.alert, controller.update);

// PATCH - /alerts/{alert_id}
router.patch("/:id", vPath.id, validator.patch, controller.patch);

// Export the router
export default router;
