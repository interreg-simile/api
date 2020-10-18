import mongoose, { Schema } from "mongoose";

export const collection = "Users";

const schema = new Schema({
    email      : { type: String, unique: true, required: true },
    password   : { type: String, required: true },
    isConfirmed: { type: Boolean, required: true, default: false },
    name       : { type: String, required: true },
    surname    : { type: String, required: true },
    city       : { type: String, required: false },
    yearOfBirth: { type: Number, required: false },
    gender     : { type: String, required: false }
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
