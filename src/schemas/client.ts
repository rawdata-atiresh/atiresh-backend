import { Document, Schema, Types, SchemaTypes } from "mongoose";

export const ClientsSchema = new Schema({
    name: String,
    first_name: String,
    surname: String,
    company_name: String,
    email: { type: String, lowercase: true },
    address: String,
    postcode: String,
    mobile: Number,
    telephone: { type:Number, default:null},
    logo: String,
    licenseStartDate:Date,
    licenseEndDate:Date,
    freeze_asset:{ type:Boolean, default:false},
    // storage:Number,
    // startDate:Date,
    // leaveDate:Date,
    createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
    active_flag: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface Client extends Document {

    name: string;
    first_name: string;
    surname: string;
    company_name: string;
    email: string
    address: string;
    postcode: string;
    mobile: number;
    telephone: number;
    licenseStartDate:Date;
    licenseEndDate:Date;
    // storage:number;
    // startDate:Date;
    // endDate:Date;
    logo: string;
    createdBy: Types.ObjectId;
    active_flag: boolean;

}
