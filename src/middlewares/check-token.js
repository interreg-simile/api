/**
 * @fileoverview This file contains the logic needed to check the authorization token of the user performing a request
 * and to assess if she has the right permissions to proceed in the request. The permissions needed for each endpoint
 * are defined in the configuration file `api/scr/config/endpoints.yaml`.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import jwt from "jsonwebtoken";

import { JWT_PK } from "../setup/env";
import constructError from "../utils/construct-error";

/**
 * Extracts and verifies the authorization token attached to an incoming request.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    const authHeader = req.get("Authorization");

    if (!authHeader) {
        if (req.config.token_required) {
            next(constructError(401));
            return;
        }

        req.isAdmin = false;
        req.userId  = null;
        next();
        return;
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, JWT_PK);
    } catch (err) {
        next(constructError(500, "messages.jwtMalformed"));
        return;
    }

    req.userId  = decodedToken.userId;
    req.isAdmin = decodedToken.isAdmin === "true";

    next();

}
