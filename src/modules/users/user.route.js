import { Router } from "express";

import * as validator from "./user.validator";
import * as controller from "./user.controller";

const router = Router();

// GET - /users/{user_id}
router.get("/:id", controller.getById)

// PATCH - /users/{user_id}/change-email
router.patch("/:id/change-email", validator.changeEmail, controller.changeEmail);

// PATCH - /users/{user_id}/change-password
router.patch("/:id/change-password", validator.changePassword, controller.changePassword);

// PATCH - /users/{user_id}/change-info
router.patch("/:id/change-info", validator.changeInfo, controller.changeInfo);

// DELETE - /users/{user_id}
router.delete("/:id", controller.deleteById)

export default router;
