/**
 * @fileoverview This file contains the services for the user endpoints. The services are workers which contain the
 * business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import bcrypt from "bcryptjs";

import User from "./user.model";
import constructError from "../../utils/construct-error";

export async function getById(id, filter, projection, options) {

    const user = await User.findOne({ _id: id, ...filter }, projection, { lean: true, ...options });

    if (!user) throw constructError(404);

    return user;

}

export async function changeEmail(id, newEmail) {
    const user = await User.findOne({ _id: id })
    if (!user) throw constructError(404);

    user.email = newEmail
    return user.save()
}

export async function changePassword(id, oldPassword, newPassword) {
    const user = await User.findOne({ _id: id })
    if (!user) throw constructError(404)

    const passwordMatch = await bcrypt.compare(oldPassword, user.password)
    if (!passwordMatch) throw constructError(401)

    user.password = await bcrypt.hash(newPassword, 12);
    return user.save()
}

export async function changeInfo(id, newInfo) {
    const user = await User.findOne({ _id: id })
    if (!user) throw constructError(404);

    user.name        = newInfo.name || user.name;
    user.surname     = newInfo.surname || user.surname;
    user.city        = newInfo.city || user.city;
    user.yearOfBirth = newInfo.yearOfBirth || user.yearOfBirth;
    user.gender      = newInfo.gender || user.gender;

    return user.save()
}