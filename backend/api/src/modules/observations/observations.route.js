/**
 * @fileoverview This file defines the observation endpoints to access and manipulate the alerts.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { Router } from "express";

import * as validator from "./observations.validator";
import * as controller from "./observations.controller";
import { vPath } from "../../utils/common-validations";


// Create a router object
const router = Router();

// GET - /observations
router.get("", validator.getAllQuery, controller.getAll);

// POST - /observations
router.post("", validator.observation, controller.create);

// GET - /observations/{obs_id}
router.get("/:id", validator.getByIdQuery, controller.getById);

// DELETE - /observations/{obs_id}
router.delete("/:id", vPath.id, controller.markForDeletion);

// Export the router
export default router;
