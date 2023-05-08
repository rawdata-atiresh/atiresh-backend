import { Client } from './client';

import { Document, Schema, Types, SchemaTypes } from "mongoose";


export const MajorChangeControlSchema = new Schema({
    createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
    //client: {type: SchemaTypes.ObjectId, ref: 'Client'},
    project: { type: SchemaTypes.ObjectId, ref: 'Project' },
    urn:{ type:String,default:null},
    status:{type:String,default:null},
    stage:{type:Number,default:null},
    name_of_the_person_completing: {type:String,default:null},
    company_details: {type:String,default:null},
    duty_holder_name: {type:String,defaukt:null},
    duty_holder_email: {type:String,default:null},
    client_name: {type:String,default:null},
    client_telephone: {type:Number,default:null},
    client_email: {type:String,default:null},
    client_address: {type:String,default:null},
    principal_contactor_name: {type:String,default:null},
    principal_contractor_telephone: {type:Number,default:null},
    principal_contractor_email: {type:String,default:null},
    principal_contractor_address: {type:String,default:null},
    principal_designer_name: {type:String,default:null},
    principal_designer_telephone: {type:Number,default:null},
    principal_designer_email: {type:String,default:null},
    principal_designer_address: {type:String,default:null},
    application_statement_under_regulation14: {type:String,default:null},
    proposed_control_change_description: {type:String,default:null},
    reason_why_the_change_proposed: {type:String,default:null},
    reason_why_major_change: {type:String,default:null},
    name_occupation_person_advice: {type:String,default:null},
    assesment_of_golden_thread_documents: {type:String,default:null},
    how_the_hrb_work: {type:String,default:null},
    regulations_11_20: {type:String,default:null},
    regulations_21: {type:String,default:null},
    regulations_22: {type:String,default:null},
    regulations_30: {type:String,default:null},
    regulations_23_28: {type:String,default:null},
    duty_holder_regulations: {type:String,default:null},
    list_of_golden_thread_documents_affected: {type:String,default:null},
    submit_date_to_mcca_to_bsr: {type:Date,default:null},
    mcca_completed_date: {type:Date,default:null},
    consulted_with_the_designer_regarding_this_change: {type:String,default:null},
    other_consulted_with_the_designer_regarding_this_change:{type:String,default:null},
    pdf_of_bsr_response:{type:Object,default:null},
    pdf_of_bsr_response_variations:{type:Object,default:null},
    approved_date:{type:Date,default:null},
    approve_status:{type:String,default:null},
    date_sent_to_bsr:{type:Date,default:null},
    majorDocuments: {type:Object}
   
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface MajorChangeControl extends Document {
    createdBy: Types.ObjectId;
    //client: Types.ObjectId;
    project: Types.ObjectId;
    urn:string;
    status:string;
    stage:Number;
    name_of_the_person_completing: string;
    company_details: string;
    duty_holder_name: String;
    duty_holder_email:String;
    client_name: string;
    client_telephone: number;
    client_email: string;
    client_address: string;
    principal_contactor_name: string;
    principal_contractor_telephone: number;
    principal_contractor_email: string;
    principal_contractor_address: string
    principal_designer_name: string;
    principal_designer_telephone: number;
    principal_designer_email: string;
    principal_designer_address: number;
    application_statement_under_regulation14: string;
    proposed_control_change_description: string;
    reason_why_the_change_proposed: string;
    reason_why_major_change: string;
    name_occupation_person_advice: string;
    assesment_of_golden_thread_documents: string;
    how_the_hrb_work: string;
    regulations_11_20: string;
    regulations_21: string;
    regulations_22: string;
    regulations_30: string;
    regulations_23_28: string;
    duty_holder_regulations: string;
    list_of_golden_thread_documents_affected: string;
    submit_date_to_mcca_to_bsr: Date;
    mcca_completed_date: Date;
    consulted_with_the_designer_regarding_this_change: string;
    other_consulted_with_the_designer_regarding_this_change:string;
    pdf_of_bsr_response:[];
    pdf_of_bsr_response_variations:[];
    approved_date:Date;
    approve_status:String;
    majorDocuments: [];
    date_sent_to_bsr:Date;
    
}


