import { any } from "joi";
import { Document, Schema, Types, SchemaTypes } from "mongoose";

export const OtpSchema = new Schema({
    token: String,
    email: String,
    secret: Object,
    expiry: String,
    app:String
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface Otp extends Document {

    token: String,
    email: String,
    secret: Object,
    expiry:String,
    app:String

}