/**
 * @fileoverview This file populates the Events collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { LoremIpsum } from "lorem-ipsum";

import Event, { collection } from "./events.model";
import { dropCollection } from "../../setup/seeder";
import User from "../users/user.model";


/**
 * Drops the Events collection and re-populates it with dummy data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Events...");

    await dropCollection(collection);

    const events = [
        {
            uid        : "5dd7bbe0701d5bdd685c1f17",
            title      : { it: "Puliamo il lago!", en: "Lets clean the lake!" },
            description: { it: new LoremIpsum().generateParagraphs(1), en: new LoremIpsum().generateParagraphs(1) },
            links: [
                {
                    nameIta: "Link Uno",
                    nameEng: "link One",
                    url    : "https://www.google.com/"
                },
                {
                    nameIta: "Link Due",
                    nameEng: "link Two",
                    url    : "https://www.google.com/"
                }
            ],
            position   : {
                type       : "Point",
                coordinates: [8.504056, 45.912573],
                address    : "Corso Giuseppe Garibaldi 23, Baveno (VB), Italia",
                city       : "Baveno"
            },
            date       : new Date().setMonth(new Date().getMonth() + 6),
            contacts   : { email: "interreg-simile@polimi.it" }
        },
        {
            uid        : "5dd7bbe0701d5bdd685c1f17",
            title      : { it: "Corso di Formazione", en: "Training course" },
            description: {
                it: "Corso della durata di 4h rivolto ai tecnici della pubblica amministrazione in cui si approfondiranno le tecnologie utilizzate dal progetto SIMILE (sensori, satelliti, App) fornendo strumenti pratici per migliorare l'attività di monitoraggio del lago.",
                en: "Four hours course for public administration technicians in which the technologies used in SIMILE project (sensors, satellites, App) will be deepened providing practical instruments to improve the lake monitoring activities."
            },
            position   : {
                type       : "Point",
                coordinates: [9.396085, 45.849199],
                address    : "Via Gaetano Previati, 1/c, Lecco (LC), Italia",
                city       : "Lecco"
            },
            date       : new Date("2020-09-09T11:00:00"),
            contacts   : { phone: "+39334992357", email: "interreg-simile@polimi.it" }
        },
        {
            uid        : "5dd7bbe0701d5bdd685c1f17",
            title      : { it: "Visita alla Zattera", en: "Raft visit" },
            description: { it: new LoremIpsum().generateParagraphs(1), en: new LoremIpsum().generateParagraphs(1) },
            position   : {
                type       : "Point",
                coordinates: [8.962459, 46.004063],
                address    : "Via Foce, 5, Lugano, Svizzera",
                city       : "Lugano"
            },
            date       : new Date().setMonth(new Date().getMonth() + 3),
            contacts   : { email: "interreg-simile@polimi.it" }
        }
    ];

    for (const event of events) await Event.create(event);

}
