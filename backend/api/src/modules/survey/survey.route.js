import { Router } from "express";

import * as controller from "./survey.controller";

// Create a router object
const router = Router();

// GET - /survey
router.get("/", controller.getAll);

// Export the router
export default router;
