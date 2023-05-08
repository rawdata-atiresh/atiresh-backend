import { Client } from './client';

import { Document, Schema, Types, SchemaTypes } from "mongoose";


export const KbirStage4Schema = new Schema({
  createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
  //client: {type: SchemaTypes.ObjectId, ref: 'Client'},
  project: { type: SchemaTypes.ObjectId, ref: 'Project' },
  urn:{ type:String,default:null},
  status: {type:String,default:null},
  stage:{type:Number,default:null},
  name_of_the_person_completing:{type:String,default:null},
  person_roles_responsibility: {type:String,default:null},
  company_name: {type:String,default:null},
  building_name: {type:String,default:null},
  postal_address: {type:String,default:null},
  client_name: {type:String,default:null},
  client_email: {type:String,default:null},
  client_telephone: {type:String,default:null},
  client_address: {type:String,default:null},
  descriptions_supplementary_provisions: {type:String,default:null},
  number_of_storeys_above_ground_level: {type:String,default:null},
  number_of_storeys_below_ground_level: {type:String,default:null},
  below_ground_storey_uses: {type:String,default:null},
  number_of_dwellings_in_buildings: {type:String,default:null},
  building_uses: {type:String,default:null},
  residential_building_other_use: {type:String,default:null},
  main_building_tenure: {type:String,default:null},
  storeys_number_of_staircases: {type:String,default:null},
  building_number_of_sprinkler_heads: {type:String,default:null},
  planning_permission_granted_date: {type:Date,default:null},
  material_and_insulation_details: {type:String,default:null},
  facade_percentage_coverage: {type:String,default:null},
  building_facade_details: {type:String,default:null},
  building_outer_surface_details: {type:String,default:null},
  wall_attachments_materials_details: {type:String,default:null},
  roof_sheeting_materials_details: {type:String,default:null},
  cover_provided_by_each_roof_details: {type:String,default:null},
  largest_fire_compartment_details: {type:String,default:null},
  building_energy_supply_details: {type:String,default:null},
  building_frame_details: {type:String,default:null},
  building_built_ground_details: {type:String,default:null},
  external_facilities_details: {type:String,default:null},
  no_of_fire_doors: {type:String,default:null},
  evacuation_strategy_details: {type:String,default:null},
  kbir_updating_reason: {type:String,default:null},
  kbir4Documents:{type:Object},
  kbir4Attachments:{type:Object,default:[]}

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


export interface KbirStage4 extends Document { 
    createdBy: Types.ObjectId;
    //client: Types.ObjectId;
    project: Types.ObjectId;
    urn:string;
    stage:Number;
    name_of_the_person_completing:string;
    person_roles_responsibility: string;
    company_name: string;
    building_name: string;
    postal_address: string;
    client_name: string;
    client_email: string;
    client_telephone: string;
    client_address: string;
    descriptions_supplementary_provisions: string;
    number_of_storeys_above_ground_level: string;
    number_of_storeys_below_ground_level: string;
    below_ground_storey_uses: string;
    number_of_dwellings_in_buildings: string;
    building_uses: string;
    residential_building_other_use: string;
    main_building_tenure: string;
    storeys_number_of_staircases: string;
    building_number_of_sprinkler_heads: string;
    planning_permission_granted_date: Date;
    material_and_insulation_details: string;
    facade_percentage_coverage: string;
    building_facade_details: string;
    building_outer_surface_details: string;
    wall_attachments_materials_details: string;
    roof_sheeting_materials_details: string;
    cover_provided_by_each_roof_details: string;
    largest_fire_compartment_details: string;
    building_energy_supply_details: string;
    building_frame_details: string;
    building_built_ground_details: string;
    external_facilities_details: string;
    no_of_fire_doors: string;
    evacuation_strategy_details: string;
    kbir_updating_reason: string;
    kbir4Documents:[];
    kbir4Attachments:[]
}