import mongoose, { Schema } from "mongoose";

export const collection = "Users";

const schema = new Schema({
    email      : { type: String, unique: true, required: true },
    password   : { type: String, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
