/**
 * @fileoverview This file contains express-validator validation chains regarding the `user` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body } from "express-validator";

export const changeEmail = [
    body("email")
        .not().isEmpty()
        .isEmail()
        .normalizeEmail(),
]

export const changePassword = [
    body("oldPassword")
        .not().isEmpty()
        .trim(),

    body("newPassword")
        .not().isEmpty()
        .trim()
        .isLength({ min: 8, max: undefined }),

    body("confirmNewPassword")
        .not().isEmpty()
        .trim()
        .custom((value, { req }) => value === req.body.newPassword)
]

export const changeInfo = [
    body("name").optional().trim().escape().not().isEmpty(),

    body("surname").optional().trim().escape().not().isEmpty(),

    body("city").optional().trim().escape(),

    body("yearOfBirth").optional().isLength({ min: 4, max: 4 }),

    body("gender").optional().trim().escape()
]

