/**
 * @fileoverview This file contains the services for the rois endpoints. The services are workers which contain
 * the business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import Roi from "./rois.model";


/**
 * Retrieves all the regions of interest in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @param {Function} t - The i18next translation function fixed on the response language.
 * @returns {Promise<Roi[]>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options, t) {

    // Retrieve the rois
    const rois = await Roi.find(filter, projection, { lean: true, ...options });

    // Populate the description fields of the events
    for (let i = 0; i < rois.length; i++) populateDescriptions(rois[i], t);

    // Return the events
    return rois;

}


/**
 * Returns the data of the region of interest in which the given point falls.
 *
 * @param {number} lon - The longitude of the point.
 * @param {number} lat - The latitude of the point.
 * @return {Promise<Roi>} A promise containing the roi.
 */
export async function getRoiByCoords(lon, lat) {

    const filter = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [lon, lat] } } } };

    return Roi.findOne(filter, {}, { lean: true });

}


/**
 * Populates the description fields of a region of interest.
 *
 * @param {Roi} roi - The region of interest.
 * @param {Function} t - The i18next translation function fixed on the response language.
 */
function populateDescriptions(roi, t) {

    roi.country["description"] = t(`models:rois.country.${roi.country.code}`);
    roi.area["description"]    = t(`models:rois.area.${roi.area.code}`);
    roi.lake["description"]    = t(`models:rois.lake.${roi.lake.code}`);

}
