/**
 * @fileoverview This file contains express-validator validation chains regarding the `auth` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body } from "express-validator";

export const register = [
    body("email")
        .not().isEmpty()
        .isEmail()
        .normalizeEmail(),

    body("password")
        .not().isEmpty()
        .trim()
        .isLength({ min: 8, max: undefined }),

    body("confirmPassword")
        .not().isEmpty()
        .trim()
        .custom((value, { req }) => value === req.body.password),

    body("name").trim().escape().not().isEmpty(),

    body("surname").trim().escape().not().isEmpty(),

    body("city").optional().trim().escape(),

    body("yearOfBirth").optional().isInt().isLength({ min: 4, max: 4 }),

    body("gender").optional().trim().escape()
]

export const login = [
    body("email")
        .not().isEmpty()
        .isEmail()
        .normalizeEmail(),

    body("password").not().isEmpty()
];
