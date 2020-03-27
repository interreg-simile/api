/**
 * @fileoverview This file contains the controller for the rois endpoints. The controllers are manages which
 * interact with the requests, take what it needs from Express, does some validation, passes the data to the right
 * service(s) and send back to the user the results.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { checkValidation } from "../../utils/common-checks";
import * as roisService from "./rois.service";


/**
 * Returns all the regions of interest saved in the database optionally filtered to include only the ones that contains
 * a specified point.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getRois = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    const lat           = req.query.lat,
          lon           = req.query.lon,
          includeCoords = req.query.includeCoords || "false";

    const filter = {}, projection = {};

    if (lat && lon)
        filter["geometry"] = { $geoIntersects: { $geometry: { type: "Point", coordinates: [lon, lat] } } };

    if (includeCoords === "false") projection.geometry = 0;

    roisService.getAll(filter, projection, {}, req.t)
        .then(rois => res.status(200).json({ meta: { code: 200 }, data: rois }))
        .catch(err => next(err))

};
