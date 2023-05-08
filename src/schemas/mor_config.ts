import { Client } from './client';

import { Document, Schema, Types, SchemaTypes } from "mongoose";


export const MorSchema = new Schema({
    createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
    project: { type: SchemaTypes.ObjectId, ref: 'Project' },
    urn:{ type:String,default:null},
    status:{type:String,default:null},
    stage:{type:Number,default:null},
    section1_initial_contact_date : {type:Date},
    section1_name_of_officer:{type:String,default:null},
    section1_duty_holder_name:{type:String,default:null},
    section1_organization_name:{type:String,default:null},
    section1_user_role:{type:String,default:null},
    section2_person_type_pricipal_designer:{type:String,default:null},
    section2_person_type_pricipal_contractor:{type:String,default:null},
    section2_other_mor_person_type:{type:String,default:null},
    section2_duty_holder_name:{type:String,default:null},
    section2_duty_holder_email:{type:String,defualt:null},
    section2_user_role:{type:String,default:null},
    section3_safety_occurence_category:{type:String},
    section3_other_safety_occurence_category:{type:String},
    section4_date_of_safety_occurence: {type:Date,default:null},
    section4_address_of_site: {type:String,default:null},
    section4_occurence_type_and_details: {type:String,default:null},
    section5_risk_category: {type:String,default:null},
    mandatoryDocuments: {type:Object},
    date_sent_to_bsr:{type:Date,default:null}
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface Mor extends Document {
    createdBy: Types.ObjectId;
    project: Types.ObjectId;
    status:string;
    urn:string;
    stage:Number;
    section1_initial_contact_date : Date;
    section1_name_of_officer:string;
    section1_duty_holder_name:string;
    section1_organization_name:String;
    section1_user_role:string;     
    section2_person_type_pricipal_designer:string;
    section2_person_type_pricipal_contractor:string;
    section2_other_mor_person_type:string;
    section2_duty_holder_name:string;
    section2_duty_holder_email:string;
    section2_user_role:string;
    section3_safety_occurence_category:string;
    section3_other_safety_occurence_category:string;
    section4_date_of_safety_occurence: string;
    section4_address_of_site: string;
    section4_occurence_type_and_details: string;
    section5_risk_category: string;
    mandatoryDocuments: [];
    date_sent_to_bsr:Date;
}


