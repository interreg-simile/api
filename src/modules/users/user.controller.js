import * as userService from "./user.service";
import { checkValidation } from "../../utils/common-checks";
import constructError from "../../utils/construct-error";

export const changeEmail = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    const userId = req.params.id
    if (userId !== req.userId) {
        next(constructError(401));
        return;
    }

    const { email } = req.body

    userService.changeEmail(userId, email)
        .then(() =>  res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};

export const changePassword = (req, res, next) => {

    if (!checkValidation(req, next)) return;

    const userId = req.params.id
    if (userId !== req.userId) {
        next(constructError(401));
        return;
    }

    const { oldPassword, newPassword } = req.body

    userService.changePassword(userId,  oldPassword, newPassword)
        .then(() =>  res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
