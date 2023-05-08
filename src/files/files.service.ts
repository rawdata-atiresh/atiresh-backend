import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import directoryTree from 'directory-tree';
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, statSync, truncateSync, unlinkSync } from 'fs';
import { isAbsolute, join, resolve, sep } from 'path';
import * as dirTree from 'directory-tree';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model , Types} from 'mongoose';
import { Project } from 'src/schemas/project';
import { createTransport } from 'nodemailer'
import * as moment from 'moment';
import { Audittrail } from 'src/schemas/audit_Trail';
import { User } from 'src/schemas/user';
import { Mor } from 'src/schemas/mor_config';
import { NMor } from 'src/schemas/nmor_config';
import { MajorChangeControl } from 'src/schemas/major_change_control';
import { NonMajorChangeControl } from 'src/schemas/non_major_change_control';
import { KbirStage4 } from 'src/schemas/kbir_stage4';
import { KbirStage5 } from 'src/schemas/kbir_stage5';

@Injectable()
export class FilesService {
    transporter: any = createTransport({
        host: 'smtp.office365.com',
        port: '587',
        auth: { user: 'digitalasset_support@atiresh.co.uk', pass: 'Lov86782' },
        secureConnection: false,
        tls: { ciphers: 'SSLv3' },
    })

    constructor(
        @InjectModel('Project') private ProjectModel: Model<Project>,
        @InjectModel('Audittrail') private AudittrailModel: Model<Audittrail>,
        @InjectModel('Notification') private NotificationModel: Model<Notification>,
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Mor') private MorModel: Model<Mor>,
        @InjectModel('NMor') private NMorModel: Model<NMor>,
        @InjectModel('MajorChangeControl') private  MajorChangeControlModel: Model<MajorChangeControl>,
        @InjectModel('NonMajorChangeControl') private  NonMajorChangeControlModel: Model<NonMajorChangeControl>,
        @InjectModel('KbirStage4') private KbirStage4Model: Model<KbirStage4>,
        @InjectModel('KbirStage5') private KbirStage5Model: Model<KbirStage5>

    ) { }

    // @Cron('0 2 * * * *')
    // handleCron() {
    //     this.CheckWeeksLeft()
    // }
    // Project: req.body.project, stage: path[1], folder: path[2],
    //             document: req.body.filename, user: req.body.created_by, action: req.body.action
    async postMorFormDetails(req,res){
        try{
            // req.body.filename='Mandatory Occurrence Report'
            // req.body.action='created'
            // this.otherFeaturesAudittrail(req)
            const mor=await new this.MorModel(req).save()
            res.status(200).json({ result: 'MOR Created Successfully..', code: 200 })
            //req.body.path='5/Manufacturing & Construction'
            // req.body.filename='Mandatory Occurrence Report'
            // req.body.action='created'
           
            
        } catch(error){
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400, error })
        }
    }
    async postMajorChangeControlFormDetails (req,res){
        try{
            const mor=await new this.MajorChangeControlModel(req).save()
            res.status(200).json({ result: 'Major Change Control Created Successfully..', code: 200 })
            // var cron = require('node-cron');

            // cron.schedule('*/2 * * * * *', () => {
            // console.log('running a task every 2 minutes for cc created at ' , mor._id);
            // });
        } catch(error){
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400, error })
        }
    }
    async postNonMajorChangeControlFormDetails (req,res){
        try{
            const mor=await new this.NonMajorChangeControlModel(req).save()
            res.status(200).json({ result: 'Non Major Change Control Created Successfully..', code: 200 })
        } catch(error){
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400, error })
        }
    }
    async postKbir4Details(req,res) {
        try{
            const kbir4=await new this.KbirStage4Model(req).save()
            res.status(200).json({ result: 'KBIR Created Successfully..', code: 200 })
        } catch(error){
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400, error })
        }
    }
    async postKbir5Details(req, res) {
        try{
            const kbir5=await new this.KbirStage5Model(req).save()
            res.status(200).json({ result: 'KBIR Created Successfully..', code: 200 })
        } catch(error){
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400, error })
        }
    }
    async UpdateMor(req, res): Promise<any> {
        try {
            console.log('update', req.body._id)
            const Client = this.MorModel.findByIdAndUpdate(req.body._id, { $set: req.body }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }

    }
    async UpdateNMor(req, res): Promise<any> {
        try {
            console.log('update', req)
            const Client = this.NMorModel.findByIdAndUpdate(req.body._id, { $set: req.body }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }

    }
    async UpdateMajor(req, res): Promise<any> {
        try {
            console.log('update', req.body)
            const Client = this.MajorChangeControlModel.findByIdAndUpdate(req.body._id, { $set: req.body }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }

    }
    async UpdateNMajor(req, res): Promise<any> {
        try {
            console.log('update', req)
            const Client = this.NonMajorChangeControlModel.findByIdAndUpdate(req.body._id, { $set: req.body }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }

    }
    async UpdateKbirStage4(req, res): Promise<any> {
        try {
            console.log('update', req.body)
            const Client = this.KbirStage4Model.findByIdAndUpdate(req.body._id, { $set: req.body }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }

    }
    async UpdateKbirStage5(req, res): Promise<any> {
        try {
            console.log('update', req.body)
            const Client = this.KbirStage5Model.findByIdAndUpdate(req.body._id, { $set: req.body }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }

    }
    async getAllMorDetails(body){
        try{
            //console.log(body)
            const filteredMor=[]
            const morDetails=await this.MorModel.find({"project":body._id}).sort({ updated_at: 'desc' }).exec()
           // console.log(morDetails)
           for(let j=0;j<morDetails.length;j++){
            for (let i=0;i<=body.stage;i++){
                    console.log(morDetails[j]['stage'],i)
                    if(morDetails[j]['stage']==i){
                        filteredMor.push(morDetails[j])
                    }
                }
            }
            console.log(filteredMor)
            return filteredMor
        } catch (error){
            console.log(error)
            return error

        }
    }
    async getMajorChangeControlList(body){
        try{
            const filteredMCC=[]
            const majorChangeControlDetails=await this.MajorChangeControlModel.find({"project":body._id}).sort({ created_at: 'desc' }).exec()
            for(let j=0;j<majorChangeControlDetails.length;j++){
                for (let i=0;i<=body.stage;i++){
                        console.log(majorChangeControlDetails[j]['stage'],i)
                        if(majorChangeControlDetails[j]['stage']==i){
                            filteredMCC.push(majorChangeControlDetails[j])
                        }
                    }
                }
            return filteredMCC
        } catch (error){
            console.log(error)
            return error
        }
    }
    async getNonMajorChangeControlList(body){
        try{
            const filteredNMCC=[]
            const nonMajorChangeControlDetails=await this.NonMajorChangeControlModel.find({"project":body._id}).sort({ created_at: 'desc' }).exec()
            for(let j=0;j<nonMajorChangeControlDetails.length;j++){
                for (let i=0;i<=body.stage;i++){
                        console.log(nonMajorChangeControlDetails[j]['stage'],i)
                        if(nonMajorChangeControlDetails[j]['stage']==i){
                            filteredNMCC.push(nonMajorChangeControlDetails[j])
                        }
                    }
                }
            return filteredNMCC
        } catch (error){
            console.log(error)
            return error
        }
    }
    
    async getKbir4List(body) {
        try{
            const KbirStage4Details=await this.KbirStage4Model.find({"project":body._id}).sort({ created_at: 'desc' }).exec()
            return KbirStage4Details
        } catch (error){
            console.log(error)
            return error
        }
    }
    async getKbir5List(body) {
        try{
            const filteredKbir=[]
            const KbirStage5Details=await this.KbirStage5Model.find({"project":body._id}).sort({ created_at: 'desc' }).exec()
            for(let j=0;j<KbirStage5Details.length;j++){
                for (let i=0;i<=body.stage;i++){
                        console.log(KbirStage5Details[j]['stage'],i)
                        if(KbirStage5Details[j]['stage']==i){
                            filteredKbir.push(KbirStage5Details[j])
                        }
                    }
                }
            return filteredKbir
            return KbirStage5Details
        } catch (error){
            console.log(error)
            return error
        }
    }
    async getExistingKbir4Attachments(id){
        try{
            const attachments=await this.KbirStage4Model.findById(id)
            .select('kbir4Attachments').lean().exec();
            return attachments
        } catch(error){
            return error
        }
    }
    async getExistingKbir5Attachments(id){
        try{
            const attachments=await this.KbirStage5Model.findById(id)
            .select('kbir5Attachments').lean().exec();
            return attachments
        } catch(error){
            return error
        }
    }
    async updateMorBsrDate(req,res){
        try {
            console.log(req.body)
            const morBsr = this.MorModel.findByIdAndUpdate(req.body._id , { $set: {'date_sent_to_bsr': req.body.date}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async uploadKbir4FileAttachment(req,res){
        try {
            console.log(req.body)
            const morBsr = this.KbirStage4Model.findByIdAndUpdate(req.body._id , { $set: {'kbir4Attachments': req.body.kbir4Attachments}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async uploadKbir5FileAttachment(req,res){
        try {
            console.log(req.body)
            const morBsr = this.KbirStage5Model.findByIdAndUpdate(req.body._id , { $set: {'kbir5Attachments': req.body.kbir5Attachments}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async updateMajorApproveStatus(req,res){
        try {
            console.log(req.body)
            const morBsr = this.MajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'approve_status': req.body.approve_status}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    res.status(HttpStatus.OK).json({ result: 'Status Updated Successfully..', code: 200 })
                }
            })
            //res.json({ result: 'success', code: 400 })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async updateMajorApproveDate(req,res){
        try {
            console.log(req.body)
            const morBsr = this.MajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'approved_date': req.body.approved_date}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    res.status(HttpStatus.OK).json({ result: 'Dates Updated Successfully..', code: 200 })
                }
            })
            //res.json({ result: 'success', code: 400 })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }

    }
    async updateMajorBsrPdf(req,res){
        try {   
            console.log(req.body)
            const majorBsr = this.MajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'pdf_of_bsr_response': req.body.pdf_of_bsr_response}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    res.status(HttpStatus.OK).json({ result: 'PDF of BSR Response Uploaded Successfully..', code: 200 })
                }
            })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async updateMajorBsrVariationPdf(req,res){
        try {   
            console.log(req.body)
            const majorBsr = this.MajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'pdf_of_bsr_response_variations': req.body.pdf_of_bsr_response_variations}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    res.status(HttpStatus.OK).json({ result: 'PDF of BSR Response Variations Uploaded Successfully..', code: 200 })
                }
            })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async updateNonMajorBsrPdf(req,res){
        try {   
            console.log(req.body)
            const majorBsr = this.NonMajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'pdf_of_bsr_response': req.body.pdf_of_bsr_response}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    res.status(HttpStatus.OK).json({ result: 'PDF of BSR Response Uploaded Successfully..', code: 200 })
                }
            })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async updateNonMajorApproveStatus(req,res){
        try {
            console.log(req.body)
            const morBsr = this.NonMajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'approve_status': req.body.approve_status}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    res.status(HttpStatus.OK).json({ result: 'Status Updated Successfully..', code: 200 })
                }
            })
            //res.json({ result: 'success', code: 400 })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async updateNonMajorApproveDate(req,res){
        try {
            console.log(req.body)
            const morBsr = this.NonMajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'approved_date': req.body.approved_date}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    res.status(HttpStatus.OK).json({ result: 'Dates Updated Successfully..', code: 200 })
                }
            })
            //res.json({ result: 'success', code: 400 })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async updateNmorBsrDate(req,res){
        try {
            console.log(req.body)
            const morBsr = this.NMorModel.findByIdAndUpdate(req.body._id , { $set: {'date_sent_to_bsr': req.body.date}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })

        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }

    }
    updateMajorBsrDate(req,res){
        try {
            console.log(req.body)
            const morBsr = this.MajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'date_sent_to_bsr': req.body.date}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })

        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    updateNonMajorBsrDate(req,res){
        try {
            console.log(req.body)
            const morBsr = this.NonMajorChangeControlModel.findByIdAndUpdate(req.body._id , { $set: {'date_sent_to_bsr': req.body.date}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Updated Successfully..', code: 200 })
                }
            })

        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
        
    }
    deleteKbir4Attachments(value,req,res){
        try {
            console.log(req.body)
            const kbir4 = this.KbirStage4Model.findByIdAndUpdate(req.body._id , { $set: {'kbir4Attachments': value.kbir4Attachments}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Attachment Deleted Successfully..', code: 200 })
                }
            })

        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
        
    }
    deleteKbir5Attachments(value,req,res){
        try {
            console.log(req.body)
            const kbir5 = this.KbirStage5Model.findByIdAndUpdate(req.body._id , { $set: {'kbir5Attachments': value.kbir5Attachments}},{ useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    res.status(HttpStatus.OK).json({ result: 'Attachment Deleted Successfully..', code: 200 })
                }
            })

        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
        
    }
    async postNMorFormDetails(req,res){
        try{
            const mor=await new this.NMorModel(req).save()
            res.status(200).json({ result: 'Non MOR Created Successfully..', code: 200 })
        } catch(error){
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400, error })       
        }
    }
    async getAllNMorDetails(body){
        try{
            const filteredNMor=[]
            const nmorDetails=await this.NMorModel.find({"project":body._id}).sort({ updated_at: 'desc' }).exec()
            for(let j=0;j<nmorDetails.length;j++){
                for (let i=0;i<=body.stage;i++){
                        console.log(nmorDetails[j]['stage'],i)
                        if(nmorDetails[j]['stage']==i){
                            filteredNMor.push(nmorDetails[j])
                        }
                    }
                }
                console.log(filteredNMor)
            return filteredNMor
        } catch (error){
            console.log(error)
            return error

        }
    }
    async getMandatoryReportById(_id): Promise<any> {
        const morDetails = await this.MorModel.findById(_id);
        return morDetails
    }
    async getNonMandatoryReportById(_id): Promise<any> {
        const nmorDetails = await this.NMorModel.findById(_id);
        return nmorDetails
    }
    async getMajorChangeControlById(_id): Promise<any> {
        const morDetails = await this.MajorChangeControlModel.findById(_id);
        return morDetails
    }
    async getNonMajorChangeControlById(_id): Promise<any> {
        const nmorDetails = await this.NonMajorChangeControlModel.findById(_id);
        return nmorDetails
    }
    async getKbir4ListById(_id: any) {
        const nmorDetails = await this.KbirStage4Model.findById(_id);
        return nmorDetails
    }
    async getKbir5ListById(_id: any) {
        const nmorDetails = await this.KbirStage5Model.findById(_id);
        return nmorDetails
    }
    async fnSaveAudittrail(req) {
        try {
            //console.log("reqqqqqq",req.body,req.user)
            const path = req.body.path.split('/');
            const user = await this.userModel.findById(req.user._id)
                .select('first_name last_name').lean().exec();
            const userFullName = user.first_name + ' ' + user.last_name
            const project = await this.ProjectModel.findById(req.body.project)
                .select('ProjectName')
           // console.log("user and project",user,project)
            //console.log("path",path[1])
            const u = await this.userModel.aggregate([
                { $match: { _id: Types.ObjectId(req.user._id) } },
                {$unwind: "$projects"},
                {$match:{"projects.project":Types.ObjectId(req.body.project),"projects.active":true}},
                {
                    $group:{
                        _id:"$projects._id",project:{$first:"$projects.project"},active:{$first:"$projects.active"},
                        freeze:{$first:"$projects.freeze"},sub_role:{$first:"$projects.sub_role"}
                    }
                }
            ])
            //console.log("u5",u)
            const user_role=u[0].sub_role
            //console.log("user role",user_role)
            const dataset = new this.AudittrailModel({
                Project: req.body.project, stage: path[1], folder: path[2],
                document: req.body.filename, user: req.user._id, action: 'Created',sub_role:user_role
            }).save()
            //if(path[1]!=-1){
            var notifications = new this.NotificationModel({
                Project: req.body.project, stage: path[1], folder: path[2], uniqueRefGtv:req.body.unique_key,
                document: req.body.filename, user: req.user._id, action: 'Created',sub_role:user_role,
                path:req.body.path,status:'Pending',Projectname:project.ProjectName,Username:userFullName
            }).save()
            return true
            //}
        } catch (error) {
            console.error(error)
            return false
        }
    }
    async updateFileUploadNotification(body,res){
        try {
            console.log(body)
            const kbir5 = this.NotificationModel.findByIdAndUpdate(body._id , { $set: {'status': body.approve_status}},{ useFindAndModify: false }, async (error, doc) => {
                console.log(error);
                if (error) {
                    res.json({ result: 'Error Occured..', code: 400 });
                } else {
                    console.log('sdd')
                    const splitPath=body.path.split('/')
                    const newPath = splitPath[0]+'/-1/'+splitPath[2]
                    const gtvFiles = await this.NotificationModel.find({'uniqueRefGtv':body.unique_key})
                    console.log("gtvvvvvvvvvvvvvvv",gtvFiles,gtvFiles.length)
                    for(let i=0;i<gtvFiles.length;i++){
                        if(gtvFiles[i]['stage']==-1){
                            const abc  = this.NotificationModel.findByIdAndUpdate(gtvFiles[i]._id , { $set: {'status': body.approve_status}},{ useFindAndModify: false }, async (error, doc) => {
                                //console.log(error);
                                if (error) {
                                    //res.json({ result: 'Error Occured..', code: 400 });
                                } else {
                                    
                                }
                        })
                    }
                   
                }
                res.status(HttpStatus.OK).json({ result: 'Status Updated Successfully..', code: 200 })
        }})

        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }
    async notificationAutoApprove(): Promise<any>{
        try {
            var cron = require('node-cron');
            this.weekelyNotifCountEmails()
            cron.schedule('*/1 * * * *', async () => {
            console.log('running a task every 1 minute for notification');
            const notif = await this.NotificationModel.find({'status':'Pending'})
            //console.log(notif)
            for(let i=0;i<notif.length;i++){
                //console.log(notif[i]['created_at'])
                const today = moment(new Date());
                const startdate = moment(notif[i]['created_at']);
                const diff = today.diff(startdate, 'hours')
                console.log(diff)
                if(diff>48){
                    const notification = await this.NotificationModel.findByIdAndUpdate(notif[i]['id'], { $set: {'status': 'Expired' }},{ useFindAndModify: false }, (error, doc) => {
                        console.log(error);
                        if (error) {
                            //res.json({ result: 'Error Occured..', code: 400 });
                        } else {
                            console.log('sdd')
                           // res.status(HttpStatus.OK).json({ result: 'Status Updated Successfully..', code: 200 })
                        }
                    })
                }
            }
            //console.log(notif)
            });
        } catch (error){

        }
      }
    async weekelyNotifCountEmails(){
        try {
            var cron = require('node-cron');
            cron.schedule('0 00 10 * * 1', async () => {
                //cron.schedule('45 * * * * *', async () => {
                console.log("11 08")
                const expiredNotif = await this.NotificationModel.find({'status':'Expired'})
                const folderNotif = await this.NotificationModel.find({'status':'Folder'})
                const superAdmins = await this.userModel.find({'type':'SuperAdmin'})
                console.log(folderNotif.length)
                for(let i=0;i<folderNotif.length;i++){
                    const today = moment(new Date());
                    const startdate = moment(folderNotif[i]['created_at']);
                    const diff = today.diff(startdate, 'days') 
                    console.log("diff",diff)
                    if(diff>7){
                        folderNotif.splice(i,1)
                    }
                }
                console.log(superAdmins.length,expiredNotif.length,folderNotif.length)
                for(let i=0;i<superAdmins.length;i++){
                    this.sendWeeklyEmails(superAdmins[i],expiredNotif.length)
                    this.sendWeeklyEmailsForFolders(folderNotif,superAdmins[i])
                    //console.log(superAdmins[i].email) 
                }
            })

        } catch (error){

        }
    }
    async otherFeaturesAudittrail(req) {
        try {
            console.log("asdasd",req.body)
            const path = req.body.path.split('/');
            // const user = await this.userModel.findById(req.user._id)
            //     .select('client').lean().exec();
            const u = await this.userModel.aggregate([
                { $match: { _id: Types.ObjectId(req.body.createdBy) } },
                {$unwind: "$projects"},
                {$match:{"projects.project":Types.ObjectId(req.body.project),"projects.active":true}},
                {
                    $group:{
                        _id:"$projects._id",project:{$first:"$projects.project"},active:{$first:"$projects.active"},
                        freeze:{$first:"$projects.freeze"},sub_role:{$first:"$projects.sub_role"}
                    }
                }
            ])
            console.log("u5",u)
            const user_role=u[0].sub_role
            console.log("user role",user_role)
            console.log("path",path[0],path[1],path[2])
            const dataset = new this.AudittrailModel({
                Project: req.body.project, 
                stage: path[0], folder: path[1],
                document: req.body.filename, user: req.body.createdBy, action: req.body.action,sub_role:user_role
            }).save()
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
    async fnSaveAudittrailPath(req) {
        try {
            console.log("audit trail req",req.body)
            const path = req.body.path.split('/');
            const user = await this.userModel.findById(req.user._id)
                .select('client').lean().exec();
            const dataset = new this.AudittrailModel({
                Project: path[0], stage: path[1], folder: path[2],
                document: path[path.length - 1], user: req.user._id, action: 'Created', client: user.client
            }).save()
            return true
        } catch (error) {
            console.error(error)
            return true
        }
    }
    async CheckWeeksLeft() {
        try {
            const projects = await this.ProjectModel.find()
                .populate('Client', 'name email')
                .select('_id ProjectName Stages').lean().exec();
            // console.log(projects)
            const self = this;
            projects.forEach(async project => {
                project.Stages.forEach(async stage => {
                    const today = moment(new Date('10-05-2021'));
                    const endate = moment(new Date(stage.end_date));
                    const diff = endate.diff(today, 'weeks')
                    console.log(diff)
                    const weeks = [8, 6, 4, 2];
                    if (weeks.includes(diff)) {
                        const mail = await self.SendEmail(project, stage, diff)
                    }
                    // console.log(weeks)
                })
            })

        } catch (error) {

        }
    }

    async fnGetFilesBypath(req): Promise<any> {
        //console.log("pathasdsad",req.body)
        const filePath = join('Uploads/', req.body.path)
        //console.log(filePath)
        const notif = await this.NotificationModel.find({"path": req.body.path})
        console.log("notif",notif)
        const fileList = dirTree(filePath, { attributes: ['mode', 'mtime'] }, (item, PATH, stats) => {
            //console.log("item",item,"end item")
            for(let i=0;i<notif.length;i++){
                if(item.name==notif[i]['document']){
                    console.log("notif-document-status",notif[i]['status'])
                    item['status']=notif[i]['status']
                }
            }
        })
        //console.log("fileList",fileList)
        return fileList
    }

    async removeDir(path) {
        const self = this;
        if (existsSync(path)) {
            const files = readdirSync(path)

            if (files.length > 0) {
                files.forEach(function (filename) {
                    if (statSync(path + "/" + filename).isDirectory()) {
                        console.log('test', self)
                        self.removeDir(path + "/" + filename)
                    } else {
                        unlinkSync(path + "/" + filename)
                    }
                })
                rmdirSync(path)
                return true
            } else {
                rmdirSync(path)
                return true
            }
        } else {
            return false
        }
    }

    async removeFile(path) {
        try {
            console.log(path)
            unlinkSync(path)
            return true
        } catch (error) {
            return console.error(error)
        }

    }


    async mkDirByPathSync(targetDir, opts) {
        const isRelativeToScript = opts && opts.isRelativeToScript;
        const initDir = isAbsolute(targetDir) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';
        var lastErr;

        return targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = resolve(baseDir, parentDir, childDir);
            try {
                mkdirSync(curDir);
                console.log(`Directory ${curDir} created!`);
            } catch (err) {
                if (err.code === 'EEXIST') { // Directory ${curDir} already exists!
                    console.log(`Directory ${curDir} already exists!`);
                    return curDir;
                }

                // The following lines of code to support Windows and Mac specific errors.
                if (err.code === 'ENOENT') { // Last dir fails with `EACCES` and current fails with `ENOENT`
                    throw lastErr;
                }

                // To avoid `EISDIR` error on Mac and `EACCES` and `EPERM` on Windows.
                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && targetDir === curDir) {
                    console.log(err)
                    throw err; // Throw if it's only the last created dir.
                }

                lastErr = err;
            }

            return curDir;
        }, initDir);
    }

    async SendEmail(project, stage, diff): Promise<any> {
        try {
            const nxWeeks = diff == 8 ? 'You will receive further reminders at 6, 4 and 2 weeks' : diff == 6 ? 'You will receive further reminders at 4 and 2 weeks' : diff == 4 ? 'You will receive further reminders in 2 weeks' : ''

            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: 'vishnu@rawdatatech.com', // list of receivers
                subject: `${project.ProjectName}: 8 week reminder to Stage ${stage.Order} closure `, // Subject line
                html: `<p>Dear ${project.Client.name},</p>
            <p>    You are receiving this automated email as a reminder that there are ${diff} weeks remaining until the agreed 
            closure of Stage ${stage.Order} for Project ${project.ProjectName}. ${nxWeeks}.
            </p>
            <p>If you have any queries concerning this process, please contact your Atiresh GTAM Manager</p>
            <p>Once the Stage has been closed, documents will no longer be editable,
             but they will remain viewable</p>
            <p>
            Regards from the Atiresh Team
            </p>
            <br>
            <br>
            <p><b>Atiresh Team</b></p>
            <p>Golden Thread Digital Asset</p>
            <p><i>Please do not reply to this email if you have a query. Please contact your GTAM Manager directly</i></p>
            <div style="display: flex;">
            <img src="cid:logo" alt="logo">
            <div>
            <p>Atiresh Ltd</p>
            <p>Unit 33, Hebden Bridge Town Hall</p>
            <p>St George's Street</p>
            <p>Hebden Bridge</p>
            <p>HX7 7BY</p>
            <a href="www.atiresh.co.uk">www.atiresh.co.uk</a>
    </div>
</div>`, // html body
                attachments: [{
                    filename: 'atiresh-logo.png',
                    path: join(__dirname, '../Uploads/images/atiresh-logo.png'),
                    cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
                }]
            });
            console.log("Message sent: %s", info.messageId);
            return info.messageId
        } catch (error) {
            console.log(error);
            return false
        }


    }
    async sendWeeklyEmails(superAdmins,expiredNotifs):Promise<any>{
        try {
            //console.log(expiredNotifs)
            //const nxWeeks = diff == 8 ? 'You will receive further reminders at 6, 4 and 2 weeks' : diff == 6 ? 'You will receive further reminders at 4 and 2 weeks' : diff == 4 ? 'You will receive further reminders in 2 weeks' : ''
            const link = `https://atiresh-frontend-o6uru.ondigitalocean.app/#/pages/ProjectList`
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: superAdmins.email, // list of receivers
                //to:'adithyarao02@gmail.com',
                subject: ` Weekely Notifications Update `, // Subject line ${project.Client.name}
                html: `<p>Dear ${superAdmins.first_name}&nbsp;${superAdmins.last_name},</p>
            <p>You are receiving this automated email as a reminder that there are <b>${expiredNotifs}</b> notifications remaining 
            this week.</p>
            <p><a href=${link}>Click Here</a> to view all the pending Notifications.</p>
            <p><b>Atiresh Team</b><br>
                Golden Thread Digital Asset</p>
                <div style="display: flex;">
                <img src="cid:logo" alt="logo" width="100" height="120">
                <div>
                <p style="margin-top:0em;">Atiresh Ltd<br>
                Unit 33, Hebden Bridge Town Hall<br>
                St George's Street<br>
                Hebden Bridge<br>
                HX7 7BY</p>
                <p>
                01422 417288<br>
                <a href="www.atiresh.co.uk">www.atiresh.co.uk</a>
                </p>
    </div>
</div>`, // html body
                attachments: [{
                    filename: 'atiresh-logo.png',
                    path: join(__dirname, '../Uploads/images/atiresh-logo.png'),
                    cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
                }]
            });
            console.log("Message sent: %s", info.messageId);
            return info.messageId
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async sendWeeklyEmailsForFolders(folderNotif,superAdmins):Promise<any>{
        try {
            console.log(folderNotif,superAdmins.email)
            var msg=''
            for(let i=0;i<folderNotif.length;i++){
                console.log(folderNotif[i])
                msg = msg+ folderNotif[i]['action']+' in Asset '+ folderNotif[i]['Projectname'] + ' in Stage ' + folderNotif[i]['stage'] +'<br>'
            }
            console.log('msg',msg,superAdmins.email)
            //const nxWeeks = diff == 8 ? 'You will receive further reminders at 6, 4 and 2 weeks' : diff == 6 ? 'You will receive further reminders at 4 and 2 weeks' : diff == 4 ? 'You will receive further reminders in 2 weeks' : ''
            const link = `https://atiresh-frontend-o6uru.ondigitalocean.app/#/pages/ProjectList`
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: superAdmins.email, // list of receivers
                //to:'adithyarao02@gmail.com',
                subject: ` Weekely Folders Update `, // Subject line ${project.Client.name}
                html: `<p>Dear ${superAdmins.first_name}&nbsp;${superAdmins.last_name},</p>
            <p>You are receiving this automated email as a reminder that there are <b>${folderNotif.length}</b> folders actions 
            this week. They are listed below</p>
            <p>${msg}</p>
             <p><b>Atiresh Team</b><br>
                Golden Thread Digital Asset</p>
                <div style="display: flex;">
                <img src="cid:logo" alt="logo" width="100" height="120">
                <div>
                <p style="margin-top:0em;">Atiresh Ltd<br>
                Unit 33, Hebden Bridge Town Hall<br>
                St George's Street<br>
                Hebden Bridge<br>
                HX7 7BY</p>
                <p>
                01422 417288<br>
                <a href="www.atiresh.co.uk">www.atiresh.co.uk</a>
                </p>
    </div>
</div>`, // html body
                attachments: [{
                    filename: 'atiresh-logo.png',
                    path: join(__dirname, '../Uploads/images/atiresh-logo.png'),
                    cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
                }]
            });
            console.log("Message sent: %s", info.messageId,"yes",info);
            return info.messageId
        }
        catch (error) {
            console.log(error);
            return false
        }
    }
    async getMORPdf(req,res):Promise<any>{
        
        console.log(req.data[0])
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument({
            bufferPages: true});
            doc.image('Uploads/images/atiresh-logo.png', {width: 50, height: 60,align: 'left'})
            doc.moveDown();
            doc.on('pageAdded', () => {
                doc.image('Uploads/images/atiresh-logo.png',{width: 50, height: 60,align: 'left'})
                doc.moveDown();
                doc.moveDown();
            })
            //doc.info['Title'] = 'Test'
            doc.moveDown();
        
        for(let i =0;i<req.data[0].length;i++){
        const CC = await this.MorModel.findById(req.data[0][i])
            .lean().exec();
        console.log("output",CC)

        doc.fontSize(14).font('Helvetica-Bold').text("Mandatory Occurrence Reporting form: (‘major’ changes to the project)").moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text("Please complete the following Mandatory Occurrence Reporting Application Form:").moveDown();
        doc.fontSize(10);
        doc.font('Helvetica-Bold')
        doc.text(`URN : ${CC.urn}`,{align:'left'})
        doc.moveDown();
        doc.text("Report Type: MANDATORY OCCURRENCE REPORT")
        doc.moveDown();
        doc.text("Status: FINISHED")
        doc.moveDown();

        doc.font('Helvetica-Bold').text("Section 1: Building Safety Regulator Communication",{paragraphGap:5})
        doc.font('Helvetica-Bold').text("1. Date initial contact was made:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_initial_contact_date).moveDown()
        doc.font('Helvetica-Bold').text("2. Name of officer within BSR:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_name_of_officer).moveDown()
        doc.font('Helvetica-Bold').text("3. Name of Duty Holder:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_duty_holder_name).moveDown()
        doc.font('Helvetica-Bold').text("4. Organization Name:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_organization_name).moveDown()
        doc.font('Helvetica-Bold').text("5. Role:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_user_role).moveDown()

        doc.font('Helvetica-Bold').text("Section 2: Details of The Person Completing This MOR",{paragraphGap:5})
        doc.font('Helvetica-Bold').text("6. I am a Principal Designer:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section2_person_type_pricipal_designer).moveDown()
        doc.font('Helvetica-Bold').text("7. I am a Principal Contractor:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section2_person_type_pricipal_contractor).moveDown()
        doc.font('Helvetica-Bold').text("8. Others:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section2_other_mor_person_type).moveDown()
        doc.font('Helvetica-Bold').text("9. Duty Holders Name:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section2_duty_holder_name).moveDown()
        doc.font('Helvetica-Bold').text("10. Role:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section2_user_role).moveDown()

        doc.font('Helvetica-Bold').text("Section 3: Safety Occurrence Category:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section3_safety_occurence_category).moveDown()

        doc.font('Helvetica-Bold').text("Section 4:  The Safety Occurrence Details:",{paragraphGap:5})
        doc.font('Helvetica-Bold').text("11. The date of the safety occurrence:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section4_date_of_safety_occurence).moveDown()
        doc.font('Helvetica-Bold').text("12. The address of the site at which the occurrence happened:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section4_address_of_site).moveDown()
        doc.font('Helvetica-Bold').text("13. The type and details of the occurrence:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section4_occurence_type_and_details).moveDown()

        doc.font('Helvetica-Bold').text("Section 5: Risk Category",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section5_risk_category).moveDown()
       
        }
        for(let i=0;i<req.data[1].length;i++){
            const CC = await this.NMorModel.findById(req.data[1][i])
            .lean().exec();
        console.log("output",CC)
        const filename=CC.urn
        console.log(filename)
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text("Non Mandatory Occurrence Reporting form: (‘major’ changes to the project)").moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text("Please complete the following Non Mandatory Occurrence Reporting Form:").moveDown();
        doc.fontSize(10);
        doc.font('Helvetica-Bold')
        doc.text(`URN : ${CC.urn} `,{align:'left'})
        doc.moveDown();
        doc.text("Report Type: NON MANDATORY OCCURRENCE REPORT")
        doc.moveDown();
        doc.text("Status: FINISHED")
        doc.moveDown();

        doc.font('Helvetica-Bold').text("Section 1: Details of The Person Completing This N-MOR",{paragraphGap:5})
        doc.font('Helvetica-Bold').text("1. I am a Principal Designer:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_person_type_pricipal_designer).moveDown()
        doc.font('Helvetica-Bold').text("2. I am a Principal Contractor:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_person_type_pricipal_contractor).moveDown()
        doc.font('Helvetica-Bold').text("3. Other:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_other_mor_person_type).moveDown()
        doc.font('Helvetica-Bold').text("4. Duty Holders Name:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_duty_holder_name).moveDown()
        doc.font('Helvetica-Bold').text("5. Role:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section1_user_role).moveDown()

        doc.font('Helvetica-Bold').text("Section 2: Safety Occurrence Categories",{paragraphGap:5})
        doc.font('Helvetica-Bold').text("6. Construction products:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section2_safety_occurence_category).moveDown()

        doc.font('Helvetica-Bold').text("Section 3: The Safety Occurrence Details",{paragraphGap:5})
        doc.font('Helvetica-Bold').text("7. The date of the safety occurrence:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section3_date_of_safety_occurence).moveDown()
        doc.font('Helvetica-Bold').text("8. The address of the site at which the occurrence happened:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section3_address_of_site).moveDown()
        doc.font('Helvetica-Bold').text("9. The type and details of the occurrence:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section3_occurence_type_and_details).moveDown()

        doc.font('Helvetica-Bold').text("Section 4: Risk Category",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section4_risk_category).moveDown()

        doc.font('Helvetica-Bold').text("Section 5: Knowledge Sharing",{paragraphGap:5})
        doc.font('Helvetica-Bold').text("10. Confirm date issued to SCOSS:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section5_confirmed_date_issued_to_scoss).moveDown()
        doc.font('Helvetica-Bold').text("11. Date shared with project team:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.section5_confirmed_date_issued_to_scoss).moveDown()
        }
        //doc.pipe(fs.createWriteStream(`MOR.pdf`));
        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Access-Control-Expose-Headers': '*',
            'Content-Disposition': 'attachment;filename=abc.pdf',
           });
        doc.on('data', (chunk) => stream.write(chunk));
        doc.on('end', () => stream.end());
        doc.end()
    }

    async getCCLPdf(req,res):Promise<any>{

        console.log(req.data[0])
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument({
            bufferPages: true});
            doc.image('Uploads/images/atiresh-logo.png', {width: 50, height: 60,align: 'left'})
            doc.moveDown();
            //doc.fontSize(8);
            doc.on('pageAdded', () => {
                doc.image('Uploads/images/atiresh-logo.png',{width: 50, height: 60,align: 'left'})
                doc.moveDown();
                doc.moveDown();
            })
            doc.moveDown();

        for(let i =0;i<req.data[0].length;i++){
        const CC = await this.MajorChangeControlModel.findById(req.data[0][i])
            .lean().exec();
        console.log("output",CC)
        doc.fontSize(14).font('Helvetica-Bold').text("Change Control Application form: (‘major’ changes to the project)").moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text("Please complete the following Change Control Application Form:").moveDown();
        doc.fontSize(10);
        doc.font('Helvetica-Bold')
        doc.text(`URN : ${CC.urn}`,{align:'left'})
        doc.moveDown();
        doc.text("Report Type: MAJOR CHANGE CONTROL")
        doc.moveDown();
        doc.text("Status: FINISHED")
        doc.moveDown();
        doc.font('Helvetica-Bold').text("1. Name of person completing this form (Author):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.name_of_the_person_completing).moveDown()
        doc.font('Helvetica-Bold').text("2. Company Details:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.company_details).moveDown()
        doc.font('Helvetica-Bold').text("3. Client Name:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.client_name).moveDown()
        doc.font('Helvetica-Bold').text("4. Client Telephone:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.client_telephone).moveDown()
        doc.font('Helvetica-Bold').text("5. Client Email:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.client_email).moveDown()
        doc.font('Helvetica-Bold').text("6. Client Address:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.client_address).moveDown()
        doc.font('Helvetica-Bold').text("7. Principal Contractor Name:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_contactor_name).moveDown()
        doc.font('Helvetica-Bold').text("8. Principal Contractor Telephone:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_contractor_telephone).moveDown()
        doc.font('Helvetica-Bold').text("9. Principal Contractor Email:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_contractor_email).moveDown()
        doc.font('Helvetica-Bold').text("10. Principal Contractor Address:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_contractor_address).moveDown()
        doc.font('Helvetica-Bold').text("11. Principal Designer Name:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_designer_name).moveDown()
        doc.font('Helvetica-Bold').text("12. Principal Designer Telephone:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_designer_telephone).moveDown()
        doc.font('Helvetica-Bold').text("13. Principal Designer Email:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_designer_email).moveDown()
        doc.font('Helvetica-Bold').text("14. Principal Designer Address:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.principal_contractor_address).moveDown()
        doc.font('Helvetica-Bold').text("15. Provide a statement that the application is made under this regulation (Regulation 14):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.application_statement_under_regulation14).moveDown()
        doc.font('Helvetica-Bold').text("16. Provide a description of the proposed controlled change:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.proposed_control_change_description).moveDown()
        doc.font('Helvetica-Bold').text("17. Provide an explanation of the reason why the change has been proposed:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.reason_why_the_change_proposed).moveDown()
        doc.font('Helvetica-Bold').text("18. Explain and define why your change is a major change:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.reason_why_major_change).moveDown()
        doc.font('Helvetica-Bold').text("19. Provide a list of the name and occupation of each person (if any) whose advice was sought regarding the proposed change (and a brief summary of any advice provided):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.name_occupation_person_advice).moveDown()
        doc.font('Helvetica-Bold').text("20. Provide an assessment of which golden thread document(s) is/are affected by the proposed change and confirmation that a revised version has been produced:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.assesment_of_golden_thread_documents).moveDown()

        doc.font('Helvetica-Bold').text("21. Provide a compliance explanation for the proposed change as to:").moveDown()
        doc.font('Helvetica-Bold').text("i) how the HRB work will (after said change is made) meet all applicable Building Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.how_the_hrb_work).moveDown()
        doc.font('Helvetica-Bold').text("ii) how the strategies, policies and procedures (re. the HRB work) will, after the proposed change is carried out, meet the requirements of:").moveDown()
        doc.font('Helvetica-Bold').text("a) Regulations 11-20 (changes to documents or persons) of the HRB Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_11_20).moveDown()
        doc.font('Helvetica-Bold').text("b) Regulations 21 (golden thread management):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_21).moveDown()
        doc.font('Helvetica-Bold').text("c) 22 (Key Building Information Record):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_22).moveDown()
        doc.font('Helvetica-Bold').text("d) 30 (Handover of the golden thread to in-occupation dutyholder) of the HRB Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_30).moveDown()
        doc.font('Helvetica-Bold').text("e) Regulations 23-28 (Mandatory Occurrence Reporting) of the HRB Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_23_28).moveDown()
        doc.font('Helvetica-Bold').text("f) the Dutyholder Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.duty_holder_regulations).moveDown()

        doc.font('Helvetica-Bold').text("22. The revised version(s) of the golden thread document(s) affected by the controlled change - provide a list below of these golden thread documents affected :",{paragraphGap:5})
        doc.font("Helvetica").text(CC.list_of_golden_thread_documents_affected).moveDown()
        doc.font('Helvetica-Bold').text("23. Confirm the date you will submit this MCCA to the BSR:",{paragraphGap:5})
        doc.font("Helvetica").text(new Date(CC.submit_date_to_mcca_to_bsr)).moveDown()
        doc.font('Helvetica-Bold').text("24. Date this MCCA was completed:",{paragraphGap:5})
        doc.font("Helvetica").text(new Date(CC.mcca_completed_date)).moveDown()
        doc.font('Helvetica-Bold').text("25. Please confirm who you consulted regarding this proposed change:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.consulted_with_the_designer_regarding_this_change).moveDown()
        //doc.pipe(fs.createWriteStream(`SampleDocument${i}.pdf`));
        //doc.pipe(res);
        //doc.end()
        }
        for(let i=0;i<req.data[1].length;i++){
            const CC = await this.NonMajorChangeControlModel.findById(req.data[1][i])
            .lean().exec();
        console.log("output",CC)
        const filename=CC.urn
        console.log(filename)
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text("Notifiable Change Control Application form: (‘major’ changes to the project)").moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text("Please complete the following Notifiable Change Control Application Form:").moveDown();
        doc.fontSize(10);
        doc.font('Helvetica-Bold')
        doc.text(`URN : ${CC.urn} `,{align:'left'})
        doc.moveDown();
        doc.text("Report Type: NOTIFIABLE CHANGE CONTROL")
        doc.moveDown();
        doc.text("Status: FINISHED")
        doc.moveDown();
        doc.font('Helvetica-Bold').text("1. Name of person completing this form (Author):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.name_of_the_person_completing).moveDown()
        doc.font('Helvetica-Bold').text("2. Company Details:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.company_details).moveDown()
        doc.font('Helvetica-Bold').text("3. Provide a description of the proposed controlled change:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.proposed_control_change_description).moveDown()
        doc.font('Helvetica-Bold').text("4. Provide an explanation of the reason why the change has been proposed:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.reason_why_the_change_proposed).moveDown()
        doc.font('Helvetica-Bold').text("5. Explain and define why your change is a 'Notifiable Change':",{paragraphGap:5})
        doc.font("Helvetica").text(CC.reason_why_notifiable_change).moveDown()
        doc.font('Helvetica-Bold').text("6. Provide a list of the name and occupation of each person (if any) whose advice was sought regarding the proposed change (and a brief summary of any advice provided):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.name_occupation_person_advice).moveDown()
        doc.font('Helvetica-Bold').text("7. Provide an assessment of which golden thread document(s) is/are affected by the proposed change and confirmation that a revised version has been produced:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.assesment_of_golden_thread_documents).moveDown()

        doc.font('Helvetica-Bold').text("21. Provide a compliance explanation for the proposed change as to:").moveDown()
        doc.font('Helvetica-Bold').text("i) how the HRB work will (after said change is made) meet all applicable Building Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.how_the_hrb_work).moveDown()
        doc.font('Helvetica-Bold').text("ii) how the strategies, policies and procedures (re. the HRB work) will, after the proposed change is carried out, meet the requirements of:").moveDown()
        doc.font('Helvetica-Bold').text("a) Regulations 11-20 (changes to documents or persons) of the HRB Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_11_20).moveDown()
        doc.font('Helvetica-Bold').text("b) Regulations 21 (golden thread management):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_21).moveDown()
        doc.font('Helvetica-Bold').text("c) 22 (KeyBuilding Information Record):",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_22).moveDown()
        doc.font('Helvetica-Bold').text("d) 30 (Handover of the golden thread to in-occupation dutyholder) of the HRB Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_30).moveDown()
        doc.font('Helvetica-Bold').text("e) Regulations 23-28 (Mandatory Occurrence Reporting) of the HRB Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.regulations_23_28).moveDown()
        doc.font('Helvetica-Bold').text("f) the Dutyholder Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.duty_holder_regulations).moveDown()

        doc.font('Helvetica-Bold').text("9. Confirm the date you will submit this NCCF to the BSR:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.submit_date_to_nccf_to_bsr).moveDown()
        doc.font('Helvetica-Bold').text("10. Date this NCCF was completed:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.nccf_completed_date).moveDown()
        doc.font('Helvetica-Bold').text("11. Principal Contractor Address:",{paragraphGap:5})
        doc.font("Helvetica").text(CC.consulted_with_the_designer_regarding_this_change).moveDown()

        }
        //doc.pipe(fs.createWriteStream(`CCL.pdf`));
        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename=abc.pdf',
           });
        doc.on('data', (chunk) => stream.write(chunk));
        doc.on('end', () => stream.end());
        doc.end()
    }

    async getKBIRPdf(req,res):Promise<any>{
        console.log(req.data[0])
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument({
            bufferPages: true});
            doc.image('Uploads/images/atiresh-logo.png', {width: 50, height: 60,align: 'left'})
            doc.moveDown();
            //doc.fontSize(8);
            doc.on('pageAdded', () => {
                doc.image('Uploads/images/atiresh-logo.png',{width: 50, height: 60,align: 'left'})
                doc.moveDown();
                doc.moveDown();
            })
            doc.moveDown();
            for(let i =0;i<req.data[0].length;i++){
                const CC = await this.KbirStage5Model.findById(req.data[0][i])
                    .lean().exec();
                console.log("output",CC)
                doc.fontSize(14).font('Helvetica-Bold').text("Key Building Information Record form: (‘major’ changes to the project)").moveDown();
                doc.fontSize(12).font('Helvetica-Bold').text("Please complete the following Key Building Information Record Form:").moveDown();
                doc.fontSize(10);
                doc.font('Helvetica-Bold')
                doc.text(`URN : ${CC.urn}`,{align:'left'})
                doc.moveDown();
                doc.text("Report Type: KEY BUILDING INFORMATION RECORD")
                doc.moveDown();
                doc.text("Status: FINISHED")
                doc.moveDown();
                doc.font('Helvetica-Bold').text("1. Name of person filling out this record:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.name_of_the_person_completing).moveDown()
                doc.font('Helvetica-Bold').text("2. Role and responsibilities of person completing this record:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.person_roles_responsibility).moveDown()
                doc.font('Helvetica-Bold').text("3. Date of completion of Work:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.date_of_completion_of_work).moveDown()
                doc.font('Helvetica-Bold').text("4. Principal Person Name:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.principal_person_name).moveDown()
                doc.font('Helvetica-Bold').text("5. Principal Person Email:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.principal_person_email).moveDown()
                doc.font('Helvetica-Bold').text("6. Principal Person Telephone:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.principal_person_telephone).moveDown()
                doc.font('Helvetica-Bold').text("7. Principal Person Address:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.principal_person_address).moveDown()
                doc.font('Helvetica-Bold').text("8. Date that Building Control Approval was granted under Regulation 7 (Building Control Approval Applications : Decisions) of the HRBRegulations:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_control_approval_date).moveDown()
                doc.font('Helvetica-Bold').text("9. Provide a list and date any further Building Control Approval was granted under Regulation 17 (ChangeControl Applications : Decisions) of the HRB Regulations:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_control_approval_date).moveDown()
                doc.font('Helvetica-Bold').text("10. Fire door number, manufacturer and model (for each fire door):",{paragraphGap:5})
                doc.font("Helvetica").text(CC.fire_door_manufacturer_model).moveDown()

                doc.font('Helvetica-Bold').text("11. Details of the fire and smoke control provisions and equipment that are in the buildings:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.fire_smoke_control_provisions_details).moveDown()
                doc.font('Helvetica-Bold').text("12. Name of the Building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_name).moveDown()
                doc.font('Helvetica-Bold').text("13. Postal address or map reference:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.postal_address).moveDown()
                doc.font('Helvetica-Bold').text("14. Client Name:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.client_name).moveDown()
                doc.font('Helvetica-Bold').text("15. Client Email:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.client_email).moveDown()
                doc.font('Helvetica-Bold').text("16. Client Telephone:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.client_telephone).moveDown()
                doc.font('Helvetica-Bold').text("17. Client Address",{paragraphGap:5})
                doc.font("Helvetica").text(CC.client_address).moveDown()

                doc.font('Helvetica-Bold').text("18. Confirm the height of the completed building as determined in accordance with Regulation 5 of the Higher-Risk Buildings (Descriptions and Supplementary Provisions) Regulations:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.descriptions_supplementary_provisions).moveDown()
                doc.font('Helvetica-Bold').text("19. Confirm the number of storeys above ground level:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.number_of_storeys_above_ground_level).moveDown()
                doc.font('Helvetica-Bold').text("20. Confirm the number of storeys below ground level:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.number_of_storeys_below_ground_level).moveDown()

                doc.font('Helvetica-Bold').text("21. Confirm the number of dwellings in the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.number_of_dwellings_in_buildings).moveDown()
                doc.font('Helvetica-Bold').text("22. Confirm the uses of any below ground storeys:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.below_ground_storey_uses).moveDown()
                doc.font('Helvetica-Bold').text("23. Confirm the building use(s):",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_uses).moveDown()
                doc.font('Helvetica-Bold').text("24. If the confirmed use of the building is residential and another use, details of the proposed other use of the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.residential_building_other_use).moveDown()
                doc.font('Helvetica-Bold').text("25. If the use of the building is residential only, which is the proposed main building tenure:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.main_building_tenure).moveDown()
                doc.font('Helvetica-Bold').text("26. Number of staircases serving all storeys of the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.storeys_number_of_staircases).moveDown()
                doc.font('Helvetica-Bold').text("27. Date(s) Planning Permission was granted for the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.planning_permission_granted_date).moveDown()
                doc.font('Helvetica-Bold').text("28. Number of sprinkler heads in the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_number_of_sprinkler_heads).moveDown()
                doc.font('Helvetica-Bold').text("29. Please confirm the number of fire doors in the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.no_of_fire_doors).moveDown()

                doc.font('Helvetica-Bold').text("30. Confirm the as built facade system(s) for the building, including details of the materials and the insulation:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.material_and_insulation_details).moveDown()
                doc.font('Helvetica-Bold').text("31. Confirm the percentage coverage of each facade system on the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.facade_percentage_coverage).moveDown()
                doc.font('Helvetica-Bold').text("32. Confirm the details if whether the facade of the building has used a large panel system:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_facade_details).moveDown()
                doc.font('Helvetica-Bold').text("33. Confirm the proportion of the building's outer surface that are windows:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_outer_surface_details).moveDown()
                doc.font('Helvetica-Bold').text("34. Provide the details of any wall attachments , including their type and materials:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.wall_attachments_materials_details).moveDown()
                doc.font('Helvetica-Bold').text("35. Confirm the detail of the as built roof sheeting, including materials used:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.roof_sheeting_materials_details).moveDown()
                doc.font('Helvetica-Bold').text("36. Details of the proportion of cover provided by each roof sheeting:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.cover_provided_by_each_roof_details).moveDown()
                doc.font('Helvetica-Bold').text("37. Details of the largest proposed fire compartment in square metres:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.largest_fire_compartment_details).moveDown()
                doc.font('Helvetica-Bold').text("38. Details of energy supply to the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_energy_supply_details).moveDown()
                doc.font('Helvetica-Bold').text("39. Provide details of the as built building frame material(s):",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_frame_details).moveDown()
                doc.font('Helvetica-Bold').text("40. Details of the ground on which the building is built:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.building_built_ground_details).moveDown()
                doc.font('Helvetica-Bold').text("41. Details of any proposed external facilities , including car parks:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.external_facilities_details).moveDown()
                doc.font('Helvetica-Bold').text("42. Please provide details of the evacuation strategy for the building:",{paragraphGap:5})
                doc.font("Helvetica").text(CC.evacuation_strategy_details).moveDown()
                doc.font('Helvetica-Bold').text("43. Brief reason for updating this KBIR",{paragraphGap:5})
                doc.font("Helvetica").text(CC.kbir_updating_reason).moveDown()

            }
            //doc.pipe(fs.createWriteStream(`KBIR.pdf`));
            const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename=abc.pdf',
           });
            doc.on('data', (chunk) => stream.write(chunk));
            doc.on('end', () => stream.end());
            doc.end()
    
    }

}



