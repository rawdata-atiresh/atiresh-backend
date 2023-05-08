import { Document, Schema, Types, SchemaTypes } from "mongoose";

export const StepsSchema = new Schema({
    stage: String,
    step: Number,
    folders: [{ type: Object }],
});

export interface Steps extends Document {

    stage: String,
    step: Number,
    folders: [{}]

}