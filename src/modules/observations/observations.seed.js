/**
 * @fileoverview This file populates the Observations collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { dropCollection } from "../../setup/seeder";
import Observation, { collection } from "./observations.model";
import User from "../users/user.model";
import Roi from "../rois/rois.model";


/**
 * Drops the Observations collection and re-populates it with dummy data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Observations...");

    await dropCollection(collection);

    const observations = [
        {
            position : {
                coordinates: [9.386683, 45.855060],
                crs        : { code: 1 },
                accuracy   : 20.86549,
                roi        : "000000000000000000000001",
                area       : 1
            },
            weather  : { temperature: 25.8, sky: { code: 1 }, wind: 32 },
            details  : {
                foams  : { checked: true, extension: { code: 1 }, look: { code: 2 }, height: { code: 1 } },
                litters: { checked: true, type: [{ code: 9 }] }
            },
            measures : {
                temperature: {
                    multiple  : false,
                    val       : [{ depth: 0, val: 16 }],
                    instrument: { type: { code: 2 } }
                }
            },
            photos   : ["uploads/observations/foams.jpg"],
            createdAt: new Date("2020-04-17T12:00:00")
        },
        {
            position: {
                coordinates: [9.079017, 45.824735],
                crs        : { code: 1 },
                accuracy   : 20.86549,
                roi        : "000000000000000000000001",
                area       : 1
            },
            weather : { temperature: 25.8, sky: { code: 1 }, wind: 32 },
            details : {
                algae: {
                    checked   : true,
                    extension : { code: 1 },
                    look      : { code: 2 },
                    colour    : { code: 1 },
                    iridescent: false
                },
                foams: { checked: true }
            },
            other   : "Altri dettagli sull'osservazione..."
        },
        {
            position: {
                coordinates: [8.947198, 45.935249],
                crs        : { code: 1 },
                roi        : "000000000000000000000004",
                area       : 3
            },
            weather : { temperature: 25.8, sky: { code: 2 }, wind: 32 },
            details : {
                odours: { checked: true, intensity: { code: 1 }, origin: [{ code: 2 }, { code: 4 }] }
            },
            measures: {
                transparency: { val: 5, instrument: { type: { code: 1 }, precision: 1 } }
            },
            photos  : ["uploads/observations/default.jpg", "uploads/observations/default.jpg"]
        },
        {
            position: {
                coordinates: [9.102516, 45.861128],
                crs        : { code: 1 },
                accuracy   : 20.86549,
                roi        : "000000000000000000000001",
                area       : 1
            },
            weather : { temperature: 25.8, sky: { code: 3 } },
            details : {
                odours: { checked: true, intensity: { code: 2 }, origin: [{ code: 1 }, { code: 3 }] }
            },
            measures: {
                ph: { multiple: false, val: [{ depth: 1, val: 7 }], instrument: { type: { code: 1 }, precision: 1 } }
            },
            photos  : ["uploads/observations/default.jpg"]
        }
    ];

    for (const obs of observations) await Observation.create(obs);

}
