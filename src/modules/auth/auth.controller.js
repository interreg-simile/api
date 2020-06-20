/**
 * @fileoverview This file contains the controller for the auth endpoints. The controllers are manages which interact
 * with the requests, take what it needs from Express, does some validation, passes the data to the right service(s)
 * and send back to the user the results.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { checkValidation } from "../../utils/common-checks";
import * as authService from "./auth.service";


/**
 * Inserts a new API key in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const createApiKey = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    authService.createKey(req.body)
        .then(key => res.status(201).json({ meta: { code: 201 }, data: { key } }))
        .catch(err => next(err));

};


export const register = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    authService.register(req.body)
        .then(user => res.status(201).json({ meta: { code: 201 }, data: { email: user.email  }}))
        .catch(err => next(err))

};

