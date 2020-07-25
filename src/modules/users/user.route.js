import { Router } from "express";

import * as validator from "./user.validator";
import * as controller from "./user.controller";

// Create a router object
const router = Router();

// GET - /user/{user_id}

// PATCH - /user/{user_id}/change-email
router.patch("/:id/change-email", validator.changeEmail, controller.changeEmail);

// PATCH - /user/{user_id}/change-password
router.patch("/:id/change-password", validator.changePassword, controller.changePassword);

// Export the router
export default router;
