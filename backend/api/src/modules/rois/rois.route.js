/**
 * @fileoverview This file defines the events endpoints to access and manipulate the regions of interest.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { Router } from "express";
import * as validator from "./rois.validator";
import * as controller from "./rois.controller";


// Create a router object
const router = Router();

// GET - rois
router.get("", validator.getRois, controller.getRois);

// Export the router
export default router;
