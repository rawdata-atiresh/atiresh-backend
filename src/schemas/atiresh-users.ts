import { Document, Schema, Types, SchemaTypes } from "mongoose";

export const AtireshUserSchema = new Schema({ 
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
    mobile: String,
    address: String,
    createdBy: { type: SchemaTypes.ObjectId, ref: 'User' },
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

  export interface AtireshUser extends Document {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    mobile: string;
    address: string;
    createdBy: Types.ObjectId;
  }