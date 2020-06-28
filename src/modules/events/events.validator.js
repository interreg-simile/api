/**
 * @fileoverview This file contains express-validator validation chains regarding the `events` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body, query, oneOf } from "express-validator";
import mongoose from "mongoose";
import yaml from "yamljs";
import path from "path";

import { vQuery, vCoords } from "../../utils/common-validations";
import { appConf } from "../../middlewares/load-config";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [

    ...vQuery.includePast,

    ...vQuery.includeDeletedAdmin,

    ...vQuery.sort

];


// Validation chain for the body of the "post" and "put" requests
export const event = [

    body("title")
        .not().isEmpty()
        .custom(v => {
            return (
                Object.keys(v).includes("it") &&
                Object.keys(v).includes("en") &&
                Object.keys(v).every(k => appConf.lngs.includes(k))
            )
        }),

    body("title.*").trim().escape(),

    body("description")
        .not().isEmpty()
        .custom(v => {
            return (
                Object.keys(v).includes("it") &&
                Object.keys(v).includes("en") &&
                Object.keys(v).every(k => appConf.lngs.includes(k))
            )
        }),

    body("description.*").trim().escape(),

    body("links").optional().isArray(),

    body("links.*.nameIta").not().isEmpty().trim().escape(),

    body("links.*.nameEng").not().isEmpty().trim().escape(),

    body("links.*.url").not().isEmpty().isURL(),

    body("hasDetails").optional().isBoolean(),

    body("position").optional(),

    body("position.type").isEmpty(),

    ...vCoords("position.coordinates", true),

    body("position.address").optional().trim().escape(),

    body("position.city").optional().trim().escape(),

    body("date").not().isEmpty().isISO8601(),

    body("contacts").not().isEmpty(),

    oneOf([
        body("contacts.email").not().isEmpty().isEmail().normalizeEmail(),
        body("contacts.phone").not().isEmpty().isMobilePhone("any", { strictMode: true })
    ]),

    body("markedForDeletion").isEmpty()

];
