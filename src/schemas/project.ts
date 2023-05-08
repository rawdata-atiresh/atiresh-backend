import { Client } from './client';

import { Document, Schema, Types, SchemaTypes } from "mongoose";
import { any, date } from 'joi';


export const ProjectSchema = new Schema({
    ProjectName: {
        type: String,
        unique: true,
    },
    AssetViewName:{type:String},
    siteAddress:{type:String,default:null},
    sitePostcode:{type:String,default:null},
    siteTelephone:{type:String,default:null},
    development_license_start_date:{type:Date,default:null},
    development_license_end_date:{type:Date,default:null},
    Client: { type: SchemaTypes.ObjectId, ref: 'Client' },
    logo: { type: String, default: '573x489-03.jpg' },
    BuildingRegistrationDate:{type:Date,default:null},
    BuildingRegistrationDateAdded:Boolean,
    FscDate:{type:Date,default:null},
    post_development_license_start_date:{ type: Date, default: null },
    post_development_license_end_date:{ type: Date, default: null },
    certificate_of_completion_date:{ type: Date, default: null },
    freeze_asset:{ type:Boolean, default:false},
    data_storage:{type:String,default:'100'},
    unlockBSM:{ type:Boolean, default:false},
    onlyEighthStage:{ type:Boolean, default:false},
    BSMFrom:{type:Date || undefined,default:null},
    BSMTo:{type:Date || undefined,default:null},
    Stages: [{
        Name: String,
        Order: Number,
        Disabled: Boolean,
        locked:{type: Boolean, default:false},
        start_date: { type: Date || null, default: null },
        end_date:  { type: Date || null, default: null },
        progress:  { type: Number, default: 0 },
        folders: [{ type: Object,unique: true}],
    }],
    active_flag: { type: Boolean, default: true },
    createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
    total_storage: Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface Project extends Document {
    ProjectName: string;
    AssetViewName:string;
    siteAddress:string;
    sitePostCode:string;
    siteTelephone:string;
    development_license_start_date:Date;
    development_license_end_date:Date;
    Client: Types.ObjectId;
    logo: string;
    BuildingRegistrationDate:Date;
    FscDate:Date;
    unlockBSM:boolean;
    BSMFrom:Date;
    BSMTo:Date;
    Stages: [{
        Name: string;
        Order: number;
        Disabled: boolean;
        locked:boolean;
        start_date: Date;
        end_date: Date;
        progress: number;
        folders:[{}]
    }],
    active_flag: boolean;
    createdBy: Types.ObjectId;
    total_storage: number;
}