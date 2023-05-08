import { Client } from './client';

import { Document, Schema, Types, SchemaTypes } from "mongoose";


export const NMorSchema = new Schema({
    createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
    project: { type: SchemaTypes.ObjectId, ref: 'Project' },
    urn:{ type:String,default:null},
    status:{type:String,default:null},
    stage:{type:Number,default:null},
    section1_person_type_pricipal_designer:{type:String,default:null},
    section1_person_type_pricipal_contractor:{type:String,default:null},
    section1_other_mor_person_type:{type:String,default:null},
    section1_duty_holder_name:{type:String,default:null},
    section1_duty_holder_email:{type:String,default:null},
    section1_user_role:{type:String,default:null},
    section2_safety_occurence_category: {type:String},
    section2_other_safety_occurence_category:{type:String},
    section3_date_of_safety_occurence: {type:Date,default:null},
    section3_address_of_site: {type:String,default:null},
    section3_occurence_type_and_details: {type:String,default:null},
    section4_risk_category: {type:String,default:null},
    section5_confirmed_date_issued_to_scoss: {type:Date},
    section5_confirmed_date_shared_with_project_team: {type:Date},
    nonMandatoryDocuments: {type:Object},
    date_sent_to_bsr:{type:Date,default:null}
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface NMor extends Document {
    createdBy: Types.ObjectId;
    project: Types.ObjectId;   
    urn:string;  
    status:string;
    stage:Number;
    section1_person_type_pricipal_designer:string;
    section1_person_type_pricipal_contractor:string;
    section1_other_mor_person_type:string;
    section1_duty_holder_name:string;
    section1_duty_holder_email:string;
    section1_user_role:string;
    section2_safety_occurence_category: string;
    section2_other_safety_occurence_category: string;
    section3_date_of_safety_occurence: string;
    section3_address_of_site: string;
    section3_occurence_type_and_details: string;
    section4_risk_category: string;
    section5_confirmed_date_issued_to_scoss: Date;
    section5_confirmed_date_shared_with_project_team: Date;
    nonMandatoryDocuments: [];
    date_sent_to_bsr:Date
}

// createdBy: [''],
// project: [''],
// section1_person_type_pricipal_designer: ['', Validators.required],
// section1_person_type_pricipal_contractor: ['', Validators.required],
// section1_other_mor_person_type: [''],
// section1_duty_holder_name: ['', Validators.required],
// section1_user_role: ['', Validators.required],
// section2_safety_occurence_category: ['', Validators.required],
// section3_date_of_safety_occurence: ['', Validators.required],
// section3_address_of_site: ['', Validators.required],
// section3_occurence_type_and_details: ['', Validators.required],
// section4_risk_category: ['', Validators.required],
// section5_confirmed_date_issued_to_scoss: ['', Validators.required],
// section5_confirmed_date_shared_with_project_team: ['', Validators.required],
// nonMandatoryDocuments: this.formBuilder.array([])