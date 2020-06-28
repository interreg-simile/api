/**
 * @fileoverview This file populates the Alerts collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { LoremIpsum } from "lorem-ipsum";

import Alert, { collection } from "./alerts.model";
import { dropCollection } from "../../setup/seeder";
import User from "../users/user.model";


/**
 * Drops the Alerts collection and re-populates it with dummy data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Alerts...");

    await dropCollection(collection);

    const alerts = [
        {
            uid      : "5dd7bbe0701d5bdd685c1f17",
            title    : { it: "Rilascio App SIMILE", en: "SIMILE App release" },
            links    : [
                {
                    nameIta: "Link Uno",
                    nameEng: "link One",
                    url    : "https://www.google.com/"
                },
            ],
            content  : { it: new LoremIpsum().generateParagraphs(1), en: new LoremIpsum().generateParagraphs(1) },
            dateEnd  : new Date().setMonth(new Date().getMonth() + 6),
            createdAt: new Date("2020-04-01T10:00:00")
        },
        {
            uid      : "5dd7bbe0701d5bdd685c1f17",
            title    : { it: "Test", en: "Test" },
            links    : [],
            content  : { it: new LoremIpsum().generateParagraphs(1), en: new LoremIpsum().generateParagraphs(1) },
            dateEnd  : new Date().setMonth(new Date().getMonth() + 6),
            createdAt: new Date("2020-04-01T10:00:00")
        }
    ];

    for (const alert of alerts) await Alert.create(alert);

}
