import { Document, Schema, Types, SchemaTypes } from "mongoose";

export const NotificationSchema = new Schema({
    Project: { type: SchemaTypes.ObjectId, ref: 'Project' },
    stage: String,
    folder: String,
    newname:{type:String,default:''},
    document: String,
    action: String,
    client: { type: SchemaTypes.ObjectId, ref: 'Client' },
    user: { type: SchemaTypes.ObjectId, ref: 'User' },
    sub_role:String,
    path:String,
    status:String,
    Projectname:String,
    Username:String,
    uniqueRefGtv:{type:String,default:null},
    read_by_user:{type:Boolean,default:false},
    read_by_staff:{type:Object,default:[]},
    read_by_superadmin:{type:Object,default:[]}
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface Notification extends Document {
    Project: Types.ObjectId;
    stage: string;
    folder: string;
    newname:string;
    uniqueRefGtv:string;
    document: string;
    action: string;
    client: Types.ObjectId;
    user: Types.ObjectId;
    sub_role:String,
    path:String,
    status:String,
    Projectname:String,
    Username:String,
    read_by_user:Boolean,
    read_by_staff:Boolean,
    ready_by_superadmin:Boolean

}