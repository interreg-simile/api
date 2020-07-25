/**
 * @fileoverview This file contains the services for the auth endpoints. The services are workers which contain the
 * business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

import { JWT_PK } from "../../setup/env";
import User from "../users/user.model"
import constructError from "../../utils/construct-error";

export async function register(data) {

    if (await User.exists({ email: data.email }))
        throw constructError(409, "Email already in use", "ConflictException");

    const hashPassword = await bcrypt.hash(data.password, 12);

    const user = new User({
        email: data.email,
        password: hashPassword,
        isConfirmed: true // TODO set this to false and implement email confirmation
    });

    return user.save();

}

export async function login(data) {

    const user = await User.findOne({ email: data.email })
    if (!user) throw constructError(404)

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) throw constructError(401, "Invalid credentials")
    if (!user.isConfirmed) throw constructError(401, "Email not verified")

    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_PK)

    return { token, userId: user._id.toString() }

}
