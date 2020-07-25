import bcrypt from "bcryptjs";

import User, { collection } from "./user.model";
import { dropCollection } from "../../setup/seeder";

export default async function () {

    console.info("SEED - Users...");

    await dropCollection(collection);

    const hashPassword = await bcrypt.hash('123456', 12);

    const users = [
        {
            _id        : "5dd7bbe0701d5bdd685c1f17",
            email      : "admin@example.com",
            password   : hashPassword,
            isConfirmed: "true",
        },
        {
            _id: "5dd7bbe0701d5bdd685c1f18",
            email      : "user1@example.com",
            password   : hashPassword,
            isConfirmed: "true"
        },
        {
            _id: "5dd7bbe0701d5bdd685c1f19",
            email      : "user2@example.com",
            password   : hashPassword,
            isConfirmed: "true",
        }
    ];

    for (const user of users) await User.create(user);

}
