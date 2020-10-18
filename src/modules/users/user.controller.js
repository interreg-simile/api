import * as userService from "./user.service";
import { checkValidation, checkAdminOrPaternity } from "../../utils/common-checks";
import constructError from "../../utils/construct-error";

export const getById = (req, res, next) => {
    const userId = req.params.id
    if (!checkAdminOrPaternity(userId, req, next)) return;

    const projection = {
        password: 0,
        isConfirmed: 0
    }

    userService.getById(userId, {}, projection, {})
        .then(user => res.status(200).json({ meta: { code: 200 }, data: user }))
        .catch(err => next(err));
};

export const changeEmail = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    const userId = req.params.id
    if (!checkAdminOrPaternity(userId, req, next)) return;

    const { email } = req.body

    userService.changeEmail(userId, email)
        .then(() =>  res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};

export const changePassword = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    const userId = req.params.id
    if (!checkAdminOrPaternity(userId, req, next)) return;

    const { oldPassword, newPassword } = req.body

    userService.changePassword(userId,  oldPassword, newPassword)
        .then(() =>  res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};

export const changeInfo = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    const userId = req.params.id
    if (!checkAdminOrPaternity(userId, req, next)) return;

    userService.changeInfo(userId, req.body)
        .then(() =>  res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};

export const deleteById = (req, res, next) => {
    const userId = req.params.id
    if (!checkAdminOrPaternity(userId, req, next)) return;

    userService.deleteById(userId)
        .then(() =>  res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));
}
