import { Document, Schema, Types, SchemaTypes } from "mongoose";

export const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  username: {
    type: String,
    unique: true,
    default: function () {
      const _t = this as any;
      return _t.email;
    }
  },
  password: String,
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  projects: [{
    project: { type: SchemaTypes.ObjectId, ref: 'Project' },
    stages: [{ type: SchemaTypes.ObjectId, ref: 'Steps' }],
    projectName:String,
    role: String,
    sub_role: String,
    start_date:Date,
    leave_date:Date,
    duration_of_access:String,
    freeze:Boolean,
    viewAndDownload:Boolean,
    visitor_from:{type:Date,default:null},
    visitor_to:{type:Date,default:null},
    active: {
      type: Boolean,
      default: true
    },
  }],
  active_flag: {
    type: Boolean,
    default: true
  },
  postcode: String,
  website: String,
  mobile: String,
  address: String,
  company: String,
  type:String,
  freeze_user:{type:Boolean,default:false},
  //client: { type: SchemaTypes.ObjectId, ref: 'Client' },
  client: String,
  role: String,
  isAdmin: { type: Boolean, default: false },
  picture: String,
  leaveDate:{type:String,default:null},
  createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export interface User extends Document {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  postcode: string;
  website: string;
  mobile: string;
  address: string;
  company: string;
  client: string;
  role: string;
  isAdmin: string;
  type:string,
  picture: string;
  freeze_user: Boolean
  projects: [{ project: Types.ObjectId, projectName:string, stages: [Types.ObjectId], role: string, active: boolean ,visitor_from:Date,
  visitor_to:Date}];
  active_flag: boolean;
  leaveDate:string;
  createdBy: Types.ObjectId;
}