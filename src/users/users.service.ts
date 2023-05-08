import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../schemas/user'
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client } from 'src/schemas/client';
import { createTransport } from 'nodemailer'
import { AuthService } from '../auth/auth.service'
import { join } from 'path';
import * as bcrypt from 'bcrypt'
import { Project } from 'src/schemas/project';
// This should be a real class/interface representing a user entity
export type UserList = any;

@Injectable()
export class UsersService {
    transporter: any = createTransport({
        host: 'smtp.office365.com',
        port: '587',
        auth: { user: 'digitalasset_support@atiresh.co.uk', pass: 'Lov86782' },
        secureConnection: false,
        tls: { ciphers: 'SSLv3' }
    })
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('AtireshUser') private AtireshuserModel: Model<User>,
        @InjectModel('Client') private ClientModel: Model<Client>,
        @InjectModel('Project') private ProjectModel: Model<Project>,
        @InjectModel('Notification') private NotificationModel: Model<Notification>,
        public authService: AuthService
    ) { }

    async getUserProjects(user): Promise<any> {
        try {
            console.log(user)
            const userData = await this.userModel.aggregate([
                { $match: { _id: Types.ObjectId(user) } },
                {
                    "$lookup": {
                        "from": "projects",
                        "localField": "projects.project",
                        "foreignField": "_id",
                        "as": "resultingProject"
                    }
                },
                { "$unwind": "$resultingProject" },
                {
                    $group: {
                        _id: '$resultingProject._id', freeze_user:{ $first: '$freeze_user' },ProjectName: { $first: '$resultingProject.ProjectName' },
                        AssetViewName:{$first: '$resultingProject.AssetViewName'},icon: { $first: '$resultingProject.logo' }, active: {$first:false},
                        active_flag: { $first: '$resultingProject.active_flag' },data_storage:{ $first: '$resultingProject.data_storage' },
                        freeze_asset:{ $first: '$resultingProject.freeze_asset' },BuildingRegistrationDate:{$first: '$resultingProject.BuildingRegistrationDate'},
                        BuildingRegistrationDateAdded:{$first: '$resultingProject.BuildingRegistrationDateAdded'},
                        unlockBSM:{$first: '$resultingProject.unlockBSM'},onlyEighthStage:{$first: '$resultingProject.onlyEighthStage'},
                        BSMFrom:{$first: '$resultingProject.BSMFrom'},BSMTo:{$first: '$resultingProject.BSMTo'},stages:{$first: '$resultingProject.Stages'}
                    }
                }
            ]).sort({ AssetViewName: 'asc' })

            const u = await this.userModel.aggregate([
                { $match: { _id: Types.ObjectId(user) } },
                {$unwind: "$projects"},
                {$match:{"projects.active":true}},
                {
                    $group:{
                        _id:"$projects._id",project:{$first:"$projects.project"},active:{$first:"$projects.active"},
                        freeze:{$first:"$projects.freeze"},sub_role:{$first:"$projects.sub_role"},viewDownloadOnly:{$first:"$projects.viewAndDownload"}
                    }
                }
            ])
            for(let i=0;i<userData.length;i++){
                let user=userData[i]
                for (let j=0;j<u.length;j++){
                    let uu=u[j]
                    console.log(user._id,uu.project)
                    if(String(uu.project)==String(user._id)){
                        console.log("hi",uu.active)
                        if(uu.active==true){
                        console.log("byr")
                        user.active= uu.active
                        user.freeze= uu.freeze
                        user.sub_role=uu.sub_role
                        user.viewDownloadOnly=uu.viewDownloadOnly
                        if(uu.sub_role=='Client Dutyholder *' ||uu.sub_role=='PC Dutyholder *' ||uu.sub_role=='PD Dutyholder *' ||
                        uu.sub_role=='Other Dutyholder *'  ){
                        user.is_dutyholder=true
                        } else {
                        user.is_dutyholder=false
                        }
                        }
                    }
                }
            }         
            for (let i = 0; i < userData.length; i++) {
                const item = userData[i];
                if (!item.active_flag) {
                    userData.splice(i, 1)
                }
            }
            this.generatepdfCC()
            return userData
        } catch (error) {
            console.log(error)
            return error
        }

    };
    async generatepdfCC(){
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument({
            bufferPages: true});
        doc.pipe(fs.createWriteStream('SampleDocument.pdf'));
        doc.image('Uploads/images/atiresh-logo.png', {width: 50, height: 60,align: 'left'})
        doc.moveDown();
        //doc.fontSize(8);
        doc.on('pageAdded', () => {
            doc.image('Uploads/images/atiresh-logo.png',{width: 50, height: 60,align: 'left'})
            doc.moveDown();
            doc.moveDown();
        })
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text("Change Control Application form: (‘major’ changes to the project)").moveDown();
        doc.fontSize(12).font('Helvetica-Bold').text("Please complete the following Change Control Application Form:").moveDown();
        doc.fontSize(10);
        doc.font('Helvetica-Bold')
        doc.text("URN : DA1/MAJOR-CCL/001/NA",{align:'left'})
        doc.moveDown();
        doc.text("ReportType: MAJOR CHANGE CONTROL")
        doc.moveDown();
        doc.text("Status: FINISHED")
        doc.moveDown();
        doc.font('Helvetica-Bold').text("1. Name of person completing this form (Author):",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("2. Company Details:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("3. Client Name::",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("4. Client Telephone:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("5. Client Email:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("5. Client Email:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("6. Client Address:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("7. Principal Contractor Name:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("8. Principal Contractor Telephone:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("9. Principal Contractor Email:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("10. Principal Contractor Address:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("11. Principal Designer Name:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("12. Principal DesignerTelephone:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("13. Principal Designer Email:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("14. Principal Designer Address:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("15. Provide a statement that the application is made under this regulation (Regulation 14):",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("16. Provide a description of the proposed controlled change:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("17. Provide an explanation of the reason why the change has been proposed:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("18. Explain and define why your change is a major change:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("19. Provide a list of the name and occupation of each person (if any) whose advice was sought regarding the proposed change (and a brief summary of any advice provided):",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("20. Provide an assessment of which golden thread document(s) is/are affected by the proposed change and confirmation that a revised version has been produced:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()

        doc.font('Helvetica-Bold').text("21. Provide a compliance explanation for the proposed change as to:").moveDown()
        doc.font('Helvetica-Bold').text("i) how the HRBwork will (after said change is made) meet all applicable Building Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("ii) how the strategies, policies and procedures (re. the HRBwork) will, after the proposed change is carried out, meet the requirements of:").moveDown()
        doc.font('Helvetica-Bold').text("a) Regulations 11-20 (changes to documents or persons) of the HRBRegulations:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("b) Regulations 21 (golden thread management):",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("c) 22 (KeyBuilding Information Record):",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("d) 30 (Handover of the golden thread to in-occupation dutyholder) of the HRBRegulations:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("e) Regulations 23-28 (Mandatory Occurrence Reporting) of the HRBRegulations:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("f) the Dutyholder Regulations:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()

        doc.font('Helvetica-Bold').text("22. The revised version(s) of the golden thread document(s) affected by the controlle change - provide a list below of these golden thread documents affected :",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("23. Confirm the date you will submit this MCCAto the BSR:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("24. Date this MCCAwas completed:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()
        doc.font('Helvetica-Bold').text("25. Please confirm who you consulted regarding this proposed change:",{paragraphGap:5})
        doc.font("Helvetica").text("Adithya").moveDown()

        // const heading ="Mandatory Occurrence Report"
        // const questions=['asdsad asdasd asdasd asdasd ','asdasd asdasd asdsad asdasd ','asdasdsad',
        // 'asdsad asdasd asdasd asdasd ','asdasd asdasd asdsad asdasd ','asdasdsad','asdsad asdasd asdasd asdasd ',
        // 'asdasd asdasd asdsad asdasd ','asdasdsad','asdsad asdasd asdasd asdasd ','asdasd asdasd asdsad asdasd ','asdasdsad']
        // const ans=['asdsadasdasdasd','asdasdasd','asdsadasdsad','asdsad asdasd asdasd asdasd ','asdasd asdasd asdsad asdasd ',
        // 'asdasdsad','asdsad asdasd asdasd asdasd ','asdasd asdasd asdsad asdasd ','asdasdsad','asdsad asdasd asdasd asdasd ',
        // 'asdasd asdasd asdsad asdasd ','asdasdsad','asdsad asdasd asdasd asdasd ','asdasd asdasd asdsad asdasd ','asdasdsad']
        // doc.fontSize(20);
        // doc.text(`${heading}`, {
        //  width: 410,
        //  align: 'left'
        // });
        // for (let i=0;i<questions.length;i++){
        //     doc.moveDown();
        //     doc.text(`${i}  ${questions[i]}`, {
        //         width: 410,
        //         align: 'left'
        //        });
        //     doc.text(`${ans[i]}`, {
        //         width: 410,
        //         align: 'left'
        //        });
        //     doc.moveDown()
        // }
        // doc.moveDown();
        doc.end();
    }
    async getFileUploadNotif(body,res):Promise<any>{
        try{
            console.log("body",body)
            const filteredProjects = await this.userModel.aggregate([
                { $match: { _id: Types.ObjectId(body.userId) } },
                {$unwind: "$projects"},
                {$match:{"projects.active":true}},
                {
                    $group:{
                        _id:"$projects._id",project:{$first:"$projects.project"},active:{$first:"$projects.active"},
                        freeze:{$first:"$projects.freeze"},sub_role:{$first:"$projects.sub_role"},type:{$first:"$type"}
                    }
                }
            ])
            const projects=[]
            console.log(filteredProjects)
            for(let i=0;i<filteredProjects.length;i++){
                var activeprojects= await this.ProjectModel.findById(filteredProjects[i].project).select('active_flag ProjectName')            
                projects.push(activeprojects)     
            }   
            console.log("activeprojects",projects)  
            const response=[]
            if(filteredProjects[0]['type']=="SuperAdmin" ){
                console.log("superadmin")
                const finalNotification= await this.NotificationModel.aggregate(
                    [{ $match:{'status':'Expired'}}]
                ).sort({ created_at: 'desc' })
                console.log("superadmin notif",finalNotification)
                for(let j=0;j<finalNotification.length;j++){
                    response.push(finalNotification[j])
                }
            }
            if(filteredProjects[0]['type']=="AtireshStaff" || filteredProjects[0]['type']=="SuperAdmin"  ){
                console.log("yes")
                for(let i=0;i<projects.length;i++){
                    if(projects[i]!=null && projects[i].active_flag){
                        console.log("final",projects[i]._id,(body.userId))
                        const finalNotification= await this.NotificationModel.aggregate(
                            [
                                { 
                                  $match: {
                                       $and: [  
                                           {'Project':projects[i]._id}, 
                                           {$or:[{'status':'Pending'},{'status':'Expired'}]}
                                       ]
                                  }
                                }
                            ]
                            ).sort({ created_at: 'desc' })
                        console.log(finalNotification.length)
                        for(let j=0;j<finalNotification.length;j++){
                        response.push(finalNotification[j])
                        }
                    }
                }
            } else {
                for(let i=0;i<projects.length;i++){
                    if(projects[i]!=null && projects[i].active_flag){
                        console.log("final",projects[i]._id,(body.userId))
                        const finalNotification= await this.NotificationModel.aggregate(
                            [
                                { 
                                  $match: {
                                       $and: [ 
                                           {'user': Types.ObjectId(body.userId) }, 
                                           {'Project':projects[i]._id}, 
                                           {$or:[{'status':'Declined'},{'status':'Approved'}]}
                                       ]
                                  }
                                }
                            ]
                            ).sort({ created_at: 'desc' })
                        console.log(finalNotification)
                        for(let j=0;j<finalNotification.length;j++){
                            response.push(finalNotification[j])
                        }
                    }
                }
            }
            response.sort((a, b) => {
                return b.created_at - a.created_at;
            });
            for(let j=0;j<response.length;j++){
                console.log("idddddddddddddd",response)
                if(response[j].status=='Expired') {
                const userData = await this.NotificationModel.findByIdAndUpdate(response[j]._id, {$addToSet: {read_by_superadmin: body.userId}}, { useFindAndModify: false })   
                } 
                if(response[j].status=='Pending' || response[j].status=='Expired' ) {
                    if(filteredProjects[0]['type']=="SuperAdmin"){
                        const userData = await this.NotificationModel.findByIdAndUpdate(response[j]._id, {$addToSet: {read_by_superadmin: body.userId}}, { useFindAndModify: false })   
                    } else {
                        const userData = await this.NotificationModel.findByIdAndUpdate(response[j]._id, {$addToSet: {read_by_staff: body.userId}}, { useFindAndModify: false })  

                    }
                } 
                else {
                    const userData = await this.NotificationModel.findByIdAndUpdate(response[j]._id, { read_by_user: true }, { useFindAndModify: false })   
                } 
            
            }
            console.log("ressssssssssssss",response)
            var i=response.length
            while(i--){
                console.log("iiiiii",i)
                if(response[i]['stage']==-1 && response[i]['folder']!='Client Particulars'){
                    response.splice(i,1)
                }
            }
            console.log("resssssssssss2",response)
            return res.json(response)
        } catch (error){
            return error
        }
    }
    async getFileUploadNotifCount(body,res):Promise<any>{
        try{
            //console.log(body)
            const filteredProjects = await this.userModel.aggregate([
                { $match: { _id: Types.ObjectId(body.userId) } },
                {$unwind: "$projects"},
                {$match:{"projects.active":true}},
                {
                    $group:{
                        _id:"$projects._id",project:{$first:"$projects.project"},active:{$first:"$projects.active"},
                        freeze:{$first:"$projects.freeze"},sub_role:{$first:"$projects.sub_role"},type:{$first:"$type"}
                    }
                }
            ])
            const projects=[]
            //console.log(filteredProjects)
            for(let i=0;i<filteredProjects.length;i++){
                var activeprojects= await this.ProjectModel.findById(filteredProjects[i].project).select('active_flag ProjectName')            
                projects.push(activeprojects)     
            }   
            //console.log("activeprojects",projects)  
            const response=[]
            // if(filteredProjects[0]['type']=="SuperAdmin" ){
            //     //console.log("superadmin")
            //     const finalNotification= await this.NotificationModel.aggregate(
            //         [{ $match:{'status':'Expired'}}]
            //     )
            //     //console.log("superadmin notif",finalNotification)
            //     for(let j=0;j<finalNotification.length;j++){
            //         if(finalNotification[j]['read_by_superadmin'].includes(body.userId)){
            //             console.log("yes")
            //         } else {
            //             console.log("false in admin1")
            //             response.push(finalNotification[j])
            //         }
            //     }
            // }
            if(filteredProjects[0]['type']=="SuperAdmin"){

                const finalNotification= await this.NotificationModel.aggregate(
                    [{ $match:{'status':'Expired'}}]
                )
                //console.log("superadmin notif",finalNotification)
                for(let j=0;j<finalNotification.length;j++){
                    if(finalNotification[j]['read_by_superadmin'].includes(body.userId)){
                        //console.log("yes")
                    } else {
                        //console.log("false in admin1")
                        response.push(finalNotification[j])
                    }
                }


                //console.log("yes")
                for(let i=0;i<projects.length;i++){
                    if(projects[i]!=null && projects[i].active_flag){
                        //console.log("final",projects[i]._id,(body.userId))
                        const finalNotification= await this.NotificationModel.aggregate(
                            [   //{read_by_superadmin:{$in:body.userId == []}},
                                { 
                                  $match: {
                                       $and: [  
                                           {'Project':projects[i]._id}, 
                                           //{$or:[{'read_by_superadmin':false}]},
                                           {$or:[{'status':'Pending'},{'status':'Expired'}]}
                                       ]
                                  }
                                }
                            ]
                            )
                        //console.log(finalNotification.length)
                        for(let j=0;j<finalNotification.length;j++){
                            if(finalNotification[j]['read_by_superadmin'].includes(body.userId)){
                               // console.log("yes")
                            } else {
                               // console.log("false in admin2")
                                response.push(finalNotification[j])
                            }
                        }
                    }
                }
            }
            if(filteredProjects[0]['type']=="AtireshStaff"){
                //console.log("yes")
                for(let i=0;i<projects.length;i++){
                    if(projects[i]!=null && projects[i].active_flag){
                        //console.log("final",projects[i]._id,(body.userId))
                        const finalNotification= await this.NotificationModel.aggregate(
                            [
                                { 
                                  $match: {
                                       $and: [  
                                           {'Project':projects[i]._id}, 
                                           //{$or:[{'read_by_staff':false}]},
                                           {$or:[{'status':'Pending'},{'status':'Expired'}]}
                                       ]
                                  }
                                }
                            ]
                            )
                        //console.log(finalNotification.length)
                        for(let j=0;j<finalNotification.length;j++){
                            if(finalNotification[j]['read_by_staff'].includes(body.userId)){
                                //console.log("yes in staff")
                            } else {
                               // console.log("false in staff")
                                response.push(finalNotification[j])
                            }
                        }
                    }
                }
            } if(filteredProjects[0]['type']=="User") {
                for(let i=0;i<projects.length;i++){
                    if(projects[i]!=null && projects[i].active_flag){
                        //console.log("final",projects[i]._id,(body.userId))
                        const finalNotification= await this.NotificationModel.aggregate(
                            [
                                { 
                                  $match: {
                                       $and: [ 
                                           {'user': Types.ObjectId(body.userId) }, 
                                           {'Project':projects[i]._id}, 
                                           {'read_by_user':false},
                                           {$or:[{'status':'Declined'},{'status':'Approved'}]}
                                       ]
                                  }
                                }
                            ]
                            )
                        //console.log(finalNotification)
                        for(let j=0;j<finalNotification.length;j++){
                            response.push(finalNotification[j])
                        }
                    }
                }
            }
            //console.log(response,response.length)
            var i=response.length
            while(i--){
                //console.log("iiiiii",i)
                if(response[i]['stage']==-1 && response[i]['folder']!='Client Particulars'){
                    response.splice(i,1)
                }
            }
            return res.json(response.length)
        } catch (error){
            return error
        }
    }
    async getUserProfile(user): Promise<any> {
        try {
            const userData = await this.userModel.findById(user)
                .populate({ path: 'client', select: 'name logo storage' })
                .select("first_name last_name username _id isAdmin picture email freeze_user")
            return userData
        } catch (error) {
            return error
        }
    }

    async createNewUser(user, res, req): Promise<any> {
        try {
            user.createdBy = req.user._id;
            const userData = await new this.userModel(user)
            userData.save(async err => {

                if (!err) {
                    const payload = { username: user.email, sub: userData._id };
                   // const client = await this.ClientModel.findById(user.client).select('name')
                    const token = await this.authService.GenerateToken(payload)
                    console.log(payload)
                    const type='user'
                    this.sendEmail(token, user , user.type);
                    res.status(200).json({ result: 'New User created successfully..', code: 200 })
                } else {
                    console.log(err)
                    res.json({ result: 'Error Occured..', code: 400 });
                    // return console.error(err);
                }
            });
        } catch (error) {
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }
    async getAtireshStaffbyId(req,res): Promise<any>{
        console.log(req._id)
        try {
        const projectPermissions = await this.userModel.aggregate([{
            $match: { _id: Types.ObjectId(req._id) }
        },
        {
            // $project: {
            //     first_name: 1,
            //     projects:
            //     {
            //         $filter: {
            //             input: '$projects',
            //             as: 'pro',
            //             cond: {
            //                 //$and: [
            //                    // { $eq: ['$$pro.project', Types.ObjectId(req._id)] },
            //                     $eq: ['$$pro.active', true] 
            //                 //]
            //             }

            //         }
            //     }
            // }
            
            $addFields: {
                projects: {
                  $filter: {
                    input: "$projects",
                    cond: {
                      $eq: [
                        "$$this.active", true
                        
                      ]
                    }
                  }
                }
              }
        }, 
        // {
            
        //     $group: {
        //         _id: '$projects._id', 
        //         role: { "$first": '$projects.role' },
        //         permissions: { $first: '$projects.stages' }, active: { "$first": '$projects.active' },
        //         asset:{"$first": '$projects.project' },duration_of_access: {"$first": '$projects.duration_of_access'} , 
        //         start_date: {"$first": '$projects.start_date'} , leave_date:{"$first": '$projects.leave_date'}, 
        //         visitor_from:{"$first": '$projects.visitor_from'} , visitor_to:{"$first": '$projects.visitor_to'}
        //     }
        // },
        // { $unwind: '$_id' },
        // { $unwind: '$role'},
        // { $unwind: '$permissions' },
        // { $unwind: '$active' },
        // { $unwind: '$asset' },
        // { $unwind: '$duration_of_access' },
        // { $unwind: '$start_date' },
        // { $unwind: '$leave_date' },
        // { $unwind: '$visitor_from' },
        // { $unwind: '$visitor_to' }
        ])
        const result = projectPermissions;
        let i=0
        console.log("result",result)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }
    async createNewAtireshUser(user, res, req){
        try {
            user.createdBy = req.user._id;
            const userData = await new this.userModel(user)
            userData.save( async err =>{
                if (!err) {
                    const payload = { username: user.email, sub: userData._id };
                   // const client = await this.ClientModel.findById(user.client).select('name')
                    const token = await this.authService.GenerateToken(payload)
                    console.log(token,payload)
                    const type='AtireshStaff'
                    this.sendStaffEmail(token, user , type);
                    res.status(200).json({ result: 'New User created successfully..', code: 200 })
                } else {
                    console.log(err)
                    res.json({ result: 'Error Occured..', code: 400 });
                    // return console.error(err);
                }
            });
        }
        catch (error) {
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }

    async editUser(user, res): Promise<any> {
        try {
            console.log('user', user)
            const userData = await this.userModel.findByIdAndUpdate(user._id, { $set: user }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    console.error(error);
                    res.json(error)
                } else {
                    res.status(200).json({ result: 'Updated successfully..', code: 200 });
                }
            })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }

    async deleteUser(user, res): Promise<any> {
        try {
            const userData = await this.userModel.findByIdAndUpdate(user, { active_flag: false }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    console.error(error);
                    res.json(error)
                } else {
                    
                    res.status(200).json({ result: 'Deleted Successfully..', code: 200 })
                    
                }
            })
            const userDeleted =  await this.userModel.findById(user).select('first_name last_name email type').lean().exec();
            console.log(userDeleted)
            if (userDeleted.type=="AtireshStaff"){
                this.sendStaffDeletemail(userDeleted)
            } else {
                this.sendUserDeleteEmail(userDeleted)
            }
            return true
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }

    async loadUsersList(type,type2): Promise<any> {
        try {

            const users = await this.userModel.aggregate([
                //{ $match: { active_flag: true , type:type }},
                {$match: {active_flag: true, $or: [{ type: type }, { type: type2 }] }},
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "createdBy",
                        "foreignField": "_id",
                        "as": "reUsers"
                    }
                },
                // {
                //     "$lookup": {
                //         "from": "clients",
                //         "localField": "client",
                //         "foreignField": "_id",
                //         "as": "cl"
                //     }
                // },
                {
                    $group: {
                        _id: '$_id', createdBy: { $first: '$reUsers.first_name' }, first_name: { $first: '$first_name' },
                        last_name: { $first: '$last_name' }, created_at: { $first: '$created_at' },
                        company: { $first: '$company' },leaveDate: { $first: '$leaveDate' }, email:{$first:'$email'},role:{$first:'$role'}
                    }
                },
                { "$unwind": "$createdBy" }, { $unwind: '$last_name' }, { $unwind: '$first_name' }, { $unwind: '$email' },{ $unwind: '$role' }
            ]).sort({ first_name: 'asc' })
            return users;
        } catch (error) {

            return error
        }
    }

    async GetUserListByClient(req): Promise<any> {
        try {
            const user = await this.userModel.findById(req.user._id).select('client').lean().exec();
            const users = await this.userModel.aggregate([
                { $match: { active_flag: true, client: user.client } },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "createdBy",
                        "foreignField": "_id",
                        "as": "reUsers"
                    }
                },
                {
                    $group: {
                        _id: '$_id', createdBy: { $first: '$reUsers.first_name' }, first_name: { $first: '$first_name' },
                        last_name: { $first: '$last_name' }, created_at: { $first: '$created_at' },company:{$first:'$company'},role:{$first:"$role"},
                        leaveDate: { $first: '$leaveDate' }
                    }
                },
                { "$unwind": "$createdBy" }, { $unwind: '$last_name' }, { $unwind: '$first_name' }
            ]).sort({ created_at: 'desc' })
            return users;
        } catch (error) {

            return error
        }
    }

    async loadUserById(_id): Promise<any> {
        const user = await this.userModel.findById(_id);
        return user
    }

    async loadClients(): Promise<any> {
        const client = await this.ClientModel.find()
            .select('_id name');
        return client
    }

    async loadClientById(_id): Promise<any> {
        const client = await this.ClientModel.findById(_id);
        return client
    }

    async loadClientList(): Promise<any> {
        try {

            const clients = await this.ClientModel.aggregate([
                { $match: { active_flag: true } },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "createdBy",
                        "foreignField": "_id",
                        "as": "resultingUsers"
                    }
                },
                {
                    $group: {
                        _id: '$_id', createdBy: { $first: '$resultingUsers.first_name' }, name: { $first: '$name' },
                        created_at: { $first: '$created_at' }
                    }
                }
            ]).sort({ created_at: 'desc' })

            return clients

        } catch (error) {

            return error
        }
    }

    async CreateClient(user, Data, res): Promise<any> {
        try {
            Data.createdBy = user._id;
            console.log(Data)
            const newClient = await new this.ClientModel(Data)
                .save()
            res.status(HttpStatus.CREATED).json({ result: 'Created Successfully..', code: 200 })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 });
        }

    }

    async UpdateClient(Data, res): Promise<any> {
        try {
            console.log('update', Data)
            const Client = this.ClientModel.findByIdAndUpdate(Data._id, { $set: Data }, { useFindAndModify: false }, (error, doc) => {
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

    async DeleteClient(Client, res): Promise<any> {
        try {
            const userData = this.ClientModel.findByIdAndUpdate(Client, { active_flag: false }, { useFindAndModify: false }, (error, doc) => {
                console.log(error);
                if (error) {
                    res.json(error)

                } else {
                    res.status(200).json({ result: 'Deleted Successfully..', code: 200 })
                }
            })
        } catch (error) {
            return error
        }
    }

    async loadProfile(id): Promise<any> {
        try {
            const user = this.userModel.findById(id)
                .select('first_name last_name email postcode website mobile address picture')
            return user
        } catch (error) {
            return console.log(error);
        }
    }

    async GetUsers(): Promise<any> {
        try {
            const user = this.userModel.find()
                .select('first_name last_name _id company created_at role leaveDate projects')
            return user
        } catch (error) {
            return console.log(error);
        }
    }

    async UpdateUserProfile(id, user, res): Promise<any> {

        const Client = this.userModel.findByIdAndUpdate(id, { $set: user }, { useFindAndModify: false }, (error, doc) => {
            console.log(error);
            if (error) {
                res.json(error)

            } else {
                res.status(200).json({ result: 'Updated Successfully..', code: 200 })
            }
        })
    }

    async ResetUserPassword(req, res): Promise<any> {
        try {
            const userData = await this.userModel.findOne({ email: req.body.email })
                .select('email first_name').lean().exec();
            console.log(req.body.email, userData);
            if (userData !== null) {
                const payload = { username: userData.email, sub: userData._id };
                const token = await this.authService.GenerateToken(payload)
                await this.sendResetEmail(userData, token, req.body.app)
                res.json({ code: 200, result: "We sent a recovery link to you at " + userData['email'] });
            } else {
                res.json({ code: 400, result: "Users not found..!" })
            }
        } catch (error) {
            console.log(error)
            res.json({ code: 400, result: error })
        }
    }
    async changePassword(req,res): Promise<any>{
        try{
            const userData = await this.userModel.findById(req._id)
                .select('password first_name').lean().exec();
            const currentPassword=req.current_password 
            const newPassword=req.new_password     
            const isMatch = await bcrypt.compare(currentPassword, userData.password);
            console.log(isMatch)
            if(isMatch==true){
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const user = await this.userModel.findByIdAndUpdate(req._id, { password: hashedPassword }, { useFindAndModify: false },(error, doc) => {
                console.log("error",error)
                if(error==null)
                res.json({code:200,result:"Password Changed Successfully"})
            })  
            } else {
                res.json({code:400,result:"Current Password does not match"})
            }
        
        } catch (error){
            res.json({code:400})
        }
    }
    async getUserLogReport(body): Promise<any> {
        try {
            console.log("body",body)
            const Dataset = await this.userModel.aggregate([
                {
                    $match: {
                        created_at: {
                            $gte: new Date(body.dataset.from),
                            $lte: new Date(body.dataset.to)
                        },
                    }
                },
                {
                    $group: {
                        _id: '$_id', first_name: { $first: '$first_name' }, last_name: { $first: '$last_name' },
                        created_at: { $first: '$created_at' }, company: { $first: '$company' }, role:{ $first:'$role' },
                        leaveDate:{ $first:'$leaveDate' }
                    }
                }  
                // { $unwind: '$first_name' }, { $unwind: '$Last_name' },{ $unwind: '$created_at' }, { $unwind: '$company' },
                // { $unwind: '$role' }, { $unwind: '$leaveDate' }
            ]).sort({ date: 'desc' })
            console.log("datasetss",Dataset)
            return Dataset
        } catch (error) {
            return console.error(error);
        }
    }
    async sendResetEmail(user, token, app) {
        try {
            const link = app === 'fe' ? `https://atiresh-frontend-o6uru.ondigitalocean.app/#/auth/ResetPassword?tk=${token.accessToken}` : `https://admin-atiresh-gloo6.ondigitalocean.app/#/auth/ResetPassword?tk=${token.accessToken}`
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: user.email, // list of receivers
                subject: "Reset Password", // Subject line
                html: `
                <head>
                  <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                  </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                      <a href="www.atiresh.co.uk" title="logo" target="_blank">
                                        <img width="60" src="cid:logo" alt="logo">
                                      </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                        requested to reset your password</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                         A unique link to reset your password has been generated for you. To reset your password, click the
                                                        following link and follow the instructions.
                                                    </p>
                                                    <a href="${link}"
                                                        style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                        Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong><a href="www.atiresh.co.uk">www.atiresh.co.uk</a></strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </div>
    </div>`, // html body
                attachments: [{
                    filename: 'atiresh-logo.png',
                    path: join(__dirname, '../Uploads/images/atiresh-logo.png'),
                    cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
                }]
            });
            console.log("Message sent: %s", info.messageId);
            return true;
        } catch (error) {
            return false;
        }
    }

    async sendEmail(token, user, type) {
        try {
            console.log("sendEmail............")
            const link = `https://atiresh-frontend-o6uru.ondigitalocean.app/#/auth/SignUp?tk=${token.accessToken}?type=${type}`
            //const link = `http://localhost:4200/#/auth/SignUp?tk=${token.accessToken}&type=${type}`

            console.log(link)
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: user.email, // list of receivers
                subject: "Digital Asset Invitation", // Subject line
                html: `<p>Dear ${user.first_name},</p>
                <p> Welcome to the Atiresh Digital Asset family. </p> 
                <p>
                    Here is the link to your new Digital Asset where you can set up your account 
                    and choose a password <a href=${link}>Click Here</a>.  You will need your mobile phone or access to your emails to 
                    complete this process. 
                </p>
                <p>
                You have been granted access to this Digital Asset
                </p>
                <p>
                If you have any queries, please contact the Atiresh team on the number below.
                </p>
                <p>
                Please do not respond to this email as it has been auto generated from the software. 
                </p>
                <p>
                Regards from the Atiresh Team
                </p>
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
        } catch (error) {
            return console.error(error);
        }

    }
    async sendStaffEmail(token, user, type) {
        try {
            console.log("sendEmail staff............")
            const link = `https://atiresh-frontend-o6uru.ondigitalocean.app/#/auth/SignUp?tk=${token.accessToken}?type=${type}`
           // const link = `http://localhost:4200/#/auth/SignUp?tk=${token.accessToken}&type=${type}`

            console.log(link)
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: user.email, // list of receivers
                subject: "Digital Asset Invitation", // Subject line
                html: `<p>Dear ${user.first_name},</p>   
                <p>
                You have been added as an Atiresh staff user, please follow this link to set up your unique password <a href=${link}>Click Here</a>. 
                You will need your mobile phone or access to your emails to complete this process.
                </p>
                <p>
                You have been granted access to this Digital Asset
                </p>
                <p>
                If you have any queries, please contact the Atiresh team on the number below.
                </p>
                <p>
                Please do not respond to this email as it has been auto generated from the software. 
                </p>
                <p>
                Regards from the Atiresh Team
                </p>
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
        } catch (error) {
            return console.error(error);
        }

    }

    async sendStaffDeletemail(user){
        try {
            console.log("sendEmail staff............",user.email)
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: user.email, // list of receivers
                subject: "Digital Asset Invitation", // Subject line
                html: `<p>Dear ${user.first_name},</p>   
                <p>
                You are receiving this email as you are no longer an Atiresh Digital Asset staff user, 
                and your account has been disabled with immediate effect.
                </p>
                <p>
                If you think you have received this email in error, contact the Atiresh team on the number
                below and please do not respond to this email as it has been auto generated from the software. 
                </p>
                <p>
                Regards from the Atiresh Team
                </p>
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
        } catch (error) {
            return console.error(error);
        }
    }
    async sendUserDeleteEmail(user){
        try {
            console.log("sendEmail staff............",user.email)
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: user.email, // list of receivers
                subject: "Digital Asset Invitation", // Subject line
                html: `<p>Dear ${user.first_name},</p>   
                <p>
                You are receiving this email as you are no longer an Atiresh Digital Asset User, 
                and your account has been disabled with immediate effect.
                </p>
                <p>
                If you think you have received this email in error, contact the Atiresh team on the number
                below and please do not respond to this email as it has been auto generated from the software. 
                </p>
                <p>
                Regards from the Atiresh Team
                </p>
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
        } catch (error) {
            return console.error(error);
        }
    }


}