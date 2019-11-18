import { Router } from "express";

import * as controller from "../controllers/survey";

const router = Router();

router.get("/get-all", controller.getAll);

export default router;
