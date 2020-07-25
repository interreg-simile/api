/**
 * @fileoverview This file contains the controller for the auth endpoints. The controllers are manages which interact
 * with the requests, take what it needs from Express, does some validation, passes the data to the right service(s)
 * and send back to the user the results.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { checkValidation } from "../../utils/common-checks";
import * as authService from "./auth.service";

export const register = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    authService.register(req.body)
        .then(user => res.status(201).json({ meta: { code: 201 }, data: { email: user.email  }}))
        .catch(err => next(err))

};

export const login = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    authService.login(req.body)
        .then(data => res.status(200).json({ meta: { code: 200 }, data}))
        .catch(err => next(err))

};
