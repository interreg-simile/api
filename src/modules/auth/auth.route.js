/**
 * @fileoverview This file defines the auth endpoints.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { Router } from "express";

import * as validator from "./auth.validator";
import * as controller from "./auth.controller";
import { vPath } from "../../utils/common-validations";


// Create a router object
const router = Router();

// POST /auth/keys
router.post("/keys", validator.apiKey, controller.createApiKey);

// POST /auth/register
router.post("/register", validator.register, controller.register);

// Export the router
export default router;
