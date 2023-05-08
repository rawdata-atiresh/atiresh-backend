import { Document, Schema, Types, SchemaTypes } from "mongoose";

export const AuditTrailSchema = new Schema({
    Project: { type: SchemaTypes.ObjectId, ref: 'Project' },
    stage: String,
    folder: String,
    newname: String,
    document: String,
    action: String,
    client: { type: SchemaTypes.ObjectId, ref: 'Client' },
    user: { type: SchemaTypes.ObjectId, ref: 'User' },
    sub_role:String,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface Audittrail extends Document {
    Project: Types.ObjectId;
    stage: string;
    folder: string;
    newname: string;
    document: string;
    action: string;
    client: Types.ObjectId;
    user: Types.ObjectId;
    sub_role:String,

}