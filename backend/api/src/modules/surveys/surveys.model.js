import mongoose, { Schema } from "mongoose";

import * as validator from "./surveys.validator";
import { collection as User } from "../users/user.model";


export const collection = "Surveys";

const answerSchema = new Schema({
    position: { type: Number, required: true },
    body    : { type: String, required: true }
});

const questionSchema = new Schema({
    position: { type: Number, required: true },
    body    : { type: String, required: true },
    type    : { type: String, required: true, enum: validator.questionTypeEnum },
    answers : { type: [answerSchema], default: undefined }
});

const userAnswerSchema = new Schema({
    uid    : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    date   : { type: Date, required: true },
    answers: {
        type    : [{
            question: { type: mongoose.Schema.Types.ObjectId, required: true },
            answer  : { type: String, required: true }
        }],
        required: true
    }
});

const schema = new Schema({
    title            : { type: String, required: true },
    etc              : { type: String, required: true },
    area             : { type: String, required: true },
    expireDate       : { type: Date, required: true },
    questions        : { type: [questionSchema], required: true },
    usersAnswers     : [userAnswerSchema],
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);