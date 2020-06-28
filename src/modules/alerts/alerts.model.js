/**
 * @fileoverview This file contains the Mongoose model for an alert.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";

import { collection as User } from "../users/user.model";
import { genDCode } from "../../utils/common-schemas";


/** Name of the collection. */
export const collection = "Alerts";

const link = new Schema({
    _id    : false,
    nameIta: { type: String, required: true },
    nameEng: { type: String, required: true },
    url    : { type: String, required: true }
})

/** Schema of an alert. */
const schema = new Schema({
    uid              : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    title            : { type: Schema.Types.Mixed, required: true },
    links            : { type: [link], required: false },
    content          : { type: Schema.Types.Mixed, required: true },
    dateEnd          : { type: Date, required: true },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);