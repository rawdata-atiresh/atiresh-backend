import { Steps } from './../schemas/steps';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from 'src/schemas/project';
import { User } from 'src/schemas/user';
//import { Notification  } from 'src/schemas/notifications';
import { Defaultstages } from './stages'
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { Audittrail } from 'src/schemas/audit_Trail';
import { createTransport } from 'nodemailer'

@Injectable()
export class ProjectService {
    transporter: any = createTransport({
        host: 'smtp.office365.com',
        port: '587',
        auth: { user: 'digitalasset_support@atiresh.co.uk', pass: 'Lov86782' },
        secureConnection: false,
        tls: { ciphers: 'SSLv3' }
    })
    constructor(
        @InjectModel('Step') private StepsModel: Model<Steps>,
        @InjectModel('Notification') private NotificationModel: Model<Notification>,
        @InjectModel('Project') private ProjectModel: Model<Project>,
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Audittrail') private AudittrailModel: Model<Audittrail>
    ) { }
    async GetStepsByProject2(Project, req): Promise<any> {
        try{
            const steps = await this.ProjectModel.findById(Project)
                .select('Stages').lean().exec();
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            for (let i = 0; i < steps.Stages.length; i++) {
                const step = steps.Stages[i];
                step.start_date = step.start_date == null ? undefined: step.start_date;
                step.end_date = step.end_date == null ? undefined : step.end_date;
            }
            //console.log(steps)
            return steps

        }catch (error) {
            console.log(error)
            return error
        }
    }
    async GetStepsByProject(Project, req): Promise<any> {
        //console.log(req.user._id)
        //console.log(Project)
        try {
            const user = await this.userModel.aggregate([{
                $match: { '_id': Types.ObjectId(req.user._id) }
            },
            {
                $project: {
                    first_name: 1,
                    projects:
                    {
                        $filter: {
                            input: '$projects',
                            as: 'pro',
                            cond: {
                                $and: [
                                    { $eq: ['$$pro.project', Types.ObjectId(Project)] },
                                    { $eq: ['$$pro.active', true] }
                                ]
                            }

                        }
                    }
                }
            }, 
            {
                $group: {
                    _id: '$projects._id', user: { $first: '$_id' }, permissions: { $first: '$projects.stages' }
                }
            },
            { $unwind: '$_id' },
            { $unwind: '$permissions' }
            ])
            //console.log(user)
            const permissions = user[0].permissions;
            //console.log(user)
            const PerSteps = [];
            for (let i = 0; i < permissions.length; i++) {
                const permission = permissions[i];
                const stage = await this.StepsModel.findById(permission)
                    .select('step')
                    .lean().exec();
                PerSteps.push(stage.step)
                console.log("perstepssssss",PerSteps,stage)
            }
            
            const steps = await this.ProjectModel.findById(Project)
                .select('Stages onlyEighthStage').lean().exec();
            //console.log(steps)
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            for (let i = 0; i < steps.Stages.length; i++) {
                const step = steps.Stages[i];
                PerSteps.forEach(pstep => {
                    //step.Disabled=true
                    console.log(step.Order,pstep)
                    if (step.Order === pstep || (step.Order == null && pstep===-1)) {
                        step.Disabled = false;
                    }
                })
                step.start_date = step.start_date == null ? undefined: step.start_date;
                step.end_date = step.end_date == null ? undefined : step.end_date;
            }
            console.log(steps)
            return steps
        } catch (error) {
            console.log(error)
            return error
        }

    }
    async GetSteps(): Promise<any> {
        try {
            const steps = await this.StepsModel.find().sort({ step: 'asc' })
            return steps
        } catch (error) {
            return error
        }
    }
    async GetStageByFolder(body): Promise<any> {
        // try {
        //     var step=body.step
        //     const folders = await this.StepsModel.find({ step })
        //     // .select('folders')
        //     return folders
        // } catch (error) {
        //     return error
        // }
        try {
            // body.project="6421434efab8c50670620275"
            // console.log("hiiiii",body)
            const stage = await this.ProjectModel.aggregate([{
                $match: { _id: Types.ObjectId(body.project) }
            }, {
                $project: {
                    Stages: {
                        $filter: {
                            input: '$Stages',
                            as: 'st',
                            cond: { $eq: ['$$st.Order', Number(body.step)] }

                        }
                    }
                }
            }, {
                $group: { _id: '$_id', folders: { $first: '$Stages.folders' } ,step:{ $first: '$Stages.Order' } }
            }, { $unwind: '$folders' },{ $unwind: '$step' },
            ]).sort({ folders: 'asc' })
         if(stage[0].step==-1){
               var keys=[]
                console.log(stage[0].folders)
               for(let i=0;i<stage[0].folders.length;i++){
                    keys.push(Object.keys(stage[0].folders[i]).pop())
                     let k= Object.keys(stage[0].folders[i]).pop()
                     stage[0].folders[i][k].sort()
                     console.log(stage[0].folders.sort())
                }
           } else {
                 stage[0].folders.sort()
             }
            console.log("stage",stage)
            return stage[0]
        } catch (error) {   
            console.log(error)
            return false
        }

    }

    async getallProjects(): Promise<any> {
        try {
            const projects = await this.ProjectModel.aggregate([
                { $match: { active_flag: true } },
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
                //         "localField": "Client",
                //         "foreignField": "_id",
                //         "as": "cl"
                //     }
                // },
                {
                    $group: {
                        _id: '$_id', createdBy: { $first: '$reUsers.first_name' }, lastName:{ $first:'$reUsers.last_name'},
                         ProjectName: { $first: '$ProjectName' }, AssetViewName:{ $first: '$AssetViewName' },
                        created_at: { $first: '$created_at' }
                        //client: { $first: '$cl.name' }
                    }
                },
                { "$unwind": "$createdBy" }, { $unwind: '$ProjectName' }, { "$unwind": "$lastName" },{ $unwind: '$AssetViewName' }
                // { $unwind: '$client' }
            ]).sort({ AssetViewName: 'asc' })
            return projects
        } catch (error) {
            return console.error(error);
        }


    }

    async getallUserProjects(req): Promise<any> {
        try {
            const user = await this.userModel.findById(req.user._id).select('client').lean().exec();
            const projects = await this.ProjectModel.find({ active_flag: true, Client: user.client })
                .populate('createdBy', 'first_name')
                .select("ProjectName created_at  _id createdBy").sort({ created_at: 'desc' }).lean().exec();
            console.log(projects)
            const projectList = [];
            for (let i = 0; i < projects.length; i++) {
                const item = projects[i];
                console.log(item)
                projectList.push({ _id: item._id, ProjectName: item.ProjectName, createdBy: item.createdBy['first_name'], created_at: item['created_at'] })
            }

            return projectList
        } catch (error) {
            return console.error(error);
        }


    }

    async getProjectbyId(body, res): Promise<any> {
        try {

            const project = await this.ProjectModel.findById(body._id)
                .lean().exec()
            const projectPermissions = await this.userModel.aggregate([{
                $match: { 'projects.project': Types.ObjectId(body._id) }
            },
            {
                $project: {
                    first_name: 1,
                    projects:
                    {
                        $filter: {
                            input: '$projects',
                            as: 'pro',
                            cond: {
                                $and: [
                                    { $eq: ['$$pro.project', Types.ObjectId(body._id)] },
                                    { $eq: ['$$pro.active', true] }
                                ]
                            }

                        }
                    }
                }
            }, {
                $group: {
                    _id: '$projects._id', user: { $first: '$_id' }, role: { "$first": '$projects.role' },
                    permissions: { $first: '$projects.stages' }, active: { "$first": '$projects.active' },
                    sub_role: { "$first": '$projects.sub_role' }, duration_of_access: {"$first": '$projects.duration_of_access'} , 
                    start_date: {"$first": '$projects.start_date'} , leave_date:{"$first": '$projects.leave_date'}, 
                    visitor_from:{"$first": '$projects.visitor_from'} , visitor_to:{"$first": '$projects.visitor_to'} ,
                    freeze:{"$first": '$projects.freeze'}, viewDownloadOnly:{"$first": '$projects.viewAndDownload'}
                }
            },
            { $unwind: '$role' },
            { $unwind: '$sub_role' },
            { $unwind: '$_id' },
            { $unwind: '$active' },
            { $unwind: '$permissions' },
            { $unwind: '$start_date' },
            { $unwind: '$leave_date' },
            { $unwind: '$duration_of_access' },
            { $unwind: '$visitor_from' },
            { $unwind: '$visitor_to' },
            { $unwind: '$freeze' },
            { $unwind: '$viewDownloadOnly' }
            
            ])
            const result = { ...project, projectPermissions };
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }
    async listFoldersForAsset(body, res): Promise<any> {
        console.log(body)
        var projects=[]
        if(body.flag=='global'){
            projects=await this.ProjectModel.find({})
        } else {
            for(let i =0;i<body.assets.length;i++){
                const projects1=await this.ProjectModel.findById(body.assets[i])
                await projects.push(projects1)
            }
        }
        console.log(projects.length)
        var folders=[]
        for(let i=0; i<projects.length;i++){
            let Stages=projects[i]['Stages']
            for(let j=0;j<Stages.length;j++){
                if(body.stage==Stages[j]['Name']){
                    if(Stages[j]['Name']!="Golden Thread Vault"){
                    var flag=''
                    for(let k=0;k<Stages[j]['folders'].length;k++){
                        folders.push(Stages[j]['folders'][k])
                    }
                } else {
                    //console.log(Stages[j]['folders'])
                    flag='gtv'
                    for(let k=0;k<Stages[j]['folders'].length;k++){
                        folders.push(Stages[j]['folders'][k])
                    }
                }
            }
            }
        }
        console.log(folders)
        //console.log(Array.from(new Set(folders)))
        res.status(200).json({ result: Array.from(new Set(folders)),flag:flag })
    }
    async createNewFolders(body,user,res): Promise<any> {
        var projects=[]
        console.log(body)
        if(body.flag=='global'){
            //console.log(body)
            projects=await this.ProjectModel.find({})
        } else {
            for(let i =0;i<body.assets.length;i++){
                const projects1=await this.ProjectModel.findById(body.assets[i])
                await projects.push(projects1)
            }
        }
        for(let i=0; i<projects.length;i++){
            let Stages=projects[i]['Stages']
            let gtvfolders=body.formdata['gtvSubFolders']
            var includes = false
            for(let j=0;j<Stages.length;j++){
                if(Stages[i]['folders']){
                    for(let k=0;k<body.formdata.stages.length;k++){
                        if(body.formdata.stages[k]!='Golden Thread Vault'){
                            if(Stages[j]["Name"]==body.formdata.stages[k]){
                                for(let l=0;l<body.formdata.folderName.length;l++){
                                    if(Stages[j]['folders'].includes(body.formdata.folderName[l])){
                                        includes=true
                                    } else {
                                        console.log("does not include")
                                        if(body.formdata.folderName[l]!=null){
                                            Stages[j]['folders'].push(body.formdata.folderName[l])
                                        }
                                    }
                                }
                            }
                        } else if(body.formdata.stages[k]=='Golden Thread Vault') {
                             if(gtvfolders !=null){
                                console.log('0')
                                for(let i=0;i<Stages[j]['folders'].length;i++){
                                    for(let u=0;u<gtvfolders.length;u++){
                                        if(Stages[j]['folders'][i][gtvfolders[u]]){
                                            for(let l=0;l<body.formdata.folderName.length;l++)
                                                if(Stages[j]['folders'][i][gtvfolders[u]].includes(body.formdata.folderName[l])){
                                                    includes=true
                                                } else {
                                                    if(body.formdata.folderName[l]!=null){
                                                Stages[j]['folders'][i][gtvfolders[u]].push(body.formdata.folderName[l])
                                                    }
                                                }
                                            }
                                        }
                                    }
                             } else {
                                console.log('1')
                                for(let l=0;l<body.formdata.folderName.length;l++)
                                    if(Stages[j]['Name']==='Golden Thread Vault'){
                                        let ob={}
                                         ob[body.formdata.folderName[l]]=[]
                                         var keys=[]
                                         for(let i=0;i<Stages[j]['folders'].length;i++){
                                            //console.log(Object.keys(Stages[j]['folders'][i]))
                                            keys.push(Object.keys(Stages[j]['folders'][i]).pop())
                                         }
                                         console.log(keys,[body.formdata.folderName[l]])
                                        if(keys.includes(body.formdata.folderName[l])){
                                            includes=true
                                            console.log("yes includes",ob)
                                        } else {
                                            console.log("no include")
                                            if(body.formdata.folderName[l]!=null){
                                            Stages[j]['folders'].push(ob)
                                            }
                                        }
                                    }
                             }
                        }
                     }
                }
            }
        }
            console.log(projects)
                for(let i =0;i<projects.length;i++){
                    const projectData = await this.ProjectModel.findByIdAndUpdate(projects[i]._id, { $set: projects[i] }, { useFindAndModify: false }, async (error, doc) => {
                        if (error) {
                            return console.error(error);
            
                        } else {
                            //res.status(200).json({ result: 'Project Updated Successfully..', code: 200 })

                        }
                    })

                }
            if(includes==false){
            this.audittrailforCreateFolders(body,user)
            res.status(200).json({ result: 'Folder Updated Successfully..', code: 200 })
            } else {
                res.status(200).json({ result: 'The entered folder/s already exists in the selected path/s', code: 400 })
            }
        

    }
    async audittrailforCreateFolders(body,user){
        console.log("audit",body,user)
        if(body.flag=='global'){
            const projects=await this.ProjectModel.find({})
            for(let i =0;i<projects.length;i++){
                body.assets.push(projects[i]._id)
            }
        }
        console.log(body.assets)
        for(let i=0;i<body.assets.length;i++){
            for(let j=0;j<body.formdata.stages.length;j++){
                if(body.formdata.stages[j]=='Golden Thread Vault') body.formdata.stages[j]='GTV'
                if(body.formdata.stages[j]=='Strategic Definition') body.formdata.stages[j]=0
                if(body.formdata.stages[j]=='Preparation & Briefing') body.formdata.stages[j]=1
                if(body.formdata.stages[j]=='Concept Design') body.formdata.stages[j]=2
                if(body.formdata.stages[j]=='Spatial Coordination') body.formdata.stages[j]=3
                if(body.formdata.stages[j]=='Technical Design') body.formdata.stages[j]=4
                if(body.formdata.stages[j]=='Manufacturing & Construction') body.formdata.stages[j]=5
                if(body.formdata.stages[j]=='Handover') body.formdata.stages[j]=6
                if(body.formdata.stages[j]=='Use') body.formdata.stages[j]=7
                if(body.formdata.stages[j]=='Building Safety Manager') body.formdata.stages[j]=8
                for(let k=0;k<body.formdata.folderName.length;k++){
                console.log(body.assets[i],body.formdata.stages[j],body.formdata.folderName[k])
                const userfromdb = await this.userModel.findById(user._id)
                .select('first_name last_name').lean().exec();
                const userFullName = userfromdb.first_name + ' ' + userfromdb.last_name
                const project = await this.ProjectModel.findById(body.assets[i])
                .select('ProjectName')
                const notifications = new this.NotificationModel({
                    Project: body.assets[i], stage: body.formdata.stages[j], folder: body.formdata.folderName[k],newname:'',
                    document: '', user: user._id, action: 'Folder Created',sub_role:'',
                    path:'',status:'Folder',Projectname:project.ProjectName,Username:userFullName
                }).save()
                const dataset = new this.AudittrailModel({
                    Project: body.assets[i], stage: body.formdata.stages[j], folder:body.formdata.folderName[k],newname:'',
                    document: '', user: user._id, action: 'Folder Created'
                }).save()
            }
            }
        }
    }
    async editDeleteFolders(body,user,res): Promise<any> {
        console.log(body)
        var projects=[]
        if(body.type=='global'){    
            projects=await this.ProjectModel.find({})
        } else {
            for(let i =0;i<body.selectedAssetForLocal.length;i++){
                const projects1=await this.ProjectModel.findById(body.selectedAssetForLocal[i])
                await projects.push(projects1)
            }
        }
        if(body.flag=="delete"){
            console.log("1")
            var do_not_delete=false
            var arr=[]
            var dirObjArray=[]
            if(body.formdata.subfolders!=null){
            for(let i =0;i<projects.length;i++){
                //console.log(projects[i]._id)
                for(let r=0;r<body.formdata.subfolders.length;r++){
                const dirPath = join(__dirname, '../Uploads/'+projects[i]._id+'/'+body.formdata.stages.step+'/'+body.formdata.subfolders[r])
                //let dirPath= 'C:/Users/adith/Atiresh2/golden-thread_be/Uploads/'+projects[i]._id+'/'+body.formdata.stages.step+'/'+body.formdata.subfolders[r]
                console.log(dirPath)
                if (existsSync(dirPath)) {
                    var files = readdirSync(dirPath)
                    //console.log("files",i,files)
                    var dirObj={
                        "asset":projects[i]._id,
                        "assetName":projects[i].AssetViewName,
                        "stage":body.formdata.stages.stage,
                        "subfolders":body.formdata.subfolders[r],
                        "files":files
                    }
                    dirObjArray.push(dirObj)
                    arr.push(files)
                } else {
                    //console.log("Does not exist")
                }
                }
            }
            }
            //console.log(arr)
            if(arr.length>0){
                do_not_delete=true
            } else {
                do_not_delete=false
            }
            console.log(arr.length)
            if(body.deleteAnyway==true){
                do_not_delete=false
            } 
            //console.log(do_not_delete)
            if(do_not_delete==false){
            for(let i =0;i<projects.length;i++){
                var Stages=projects[i].Stages
                if(body.formdata.stages.stage=='Golden Thread Vault'){
                    if(body.formdata.subfolders==null){
                        console.log("yes")
                        for(let j=0;j<Stages.length;j++){
                            if(Stages[j]['Name']=='Golden Thread Vault'){
                                var folders=Stages[j]['folders']
                                for(let k=0;k<folders.length;k++){ 
                                    //console.log("hi",Object.keys(folders[k]),body.formdata.gtvSubFolders)
                                    if(body.formdata.gtvSubFolders==Object.keys(folders[k])){
                                        //console.log('bye',folders[k])
                                        folders.splice(k,1)
                                    }
                                }
                            }
                        }
                        //console.log(folders)
                    } else {
                        console.log("no")
                        for(let j=0;j<Stages.length;j++){
                            if(Stages[j]['Name']=='Golden Thread Vault'){
                                var folders=Stages[j]['folders']
                                for(let k=0;k<folders.length;k++){ 
                                    if(folders[k][body.formdata.gtvSubFolders]!=undefined){
                                        for(let u=0;u<folders[k][body.formdata.gtvSubFolders].length;u++){

                                            //For multiple delete
                                            for(let r=0;r<body.formdata.subfolders.length;r++){
                                            if(folders[k][body.formdata.gtvSubFolders][u]==body.formdata.subfolders[r]){
                                                folders[k][body.formdata.gtvSubFolders].splice(u,1)
                                            }
                                        }
                                        }
                                    }
                                }
                            }
                        }  
                        //console.log(folders) 
                    }
                } else {
                    if(Stages.Name!='Golden Thread Vault'){
                        for(let i=0;i<Stages.length;i++){
                          for(let j=0;j<Stages[i].folders.length;j++)
                           if(body.formdata.stages.stage==Stages[i].Name){
                            for(let r=0;r<body.formdata.subfolders.length;r++){
                            if(body.formdata.subfolders[r]==Stages[i].folders[j]){
                                Stages[i].folders.splice(j,1)
                            }
                            }
                          }
                        }
                    }
                }
                //console.log(Stages)
            }
            for(let i =0;i<projects.length;i++){
                const projectData = await this.ProjectModel.findByIdAndUpdate(projects[i]._id, { $set: projects[i] }, { useFindAndModify: false }, async (error, doc) => {
                    if (error) {
                        //console.error(error);
        
                    } else {
                       // res.json({ result: 'Project Updated Successfully..', code: 200 })
                    }
                })
    
            }
            this.audittrailforEditDeleteFolders(body,user)
            res.json({ result: 'Folder Updated Successfully..', code: 200 ,flag:'deleted'})
        } else {
            res.json({ result: 'Path Contains Files', code: 200 , flag:'contains_files', files: dirObjArray})
        }
        } else {
            for(let i =0;i<projects.length;i++){
                var Stages=projects[i].Stages
                if(body.formdata.stages.stage=='Golden Thread Vault'){
                    if(body.formdata.subfolders==null){
                        for(let j=0;j<Stages.length;j++){
                            if(Stages[j]['Name']=='Golden Thread Vault'){
                                var folders=Stages[j]['folders']
                                for(let k=0;k<folders.length;k++){ 
                                    //console.log("hi",Object.keys(folders[k]),body.formdata.gtvSubFolders)
                                    if(body.formdata.gtvSubFolders==Object.keys(folders[k])){
                                        //console.log(folders[k][body.formdata.gtvSubFolders])
                                        folders[k][body.formdata.folderName]=folders[k][body.formdata.gtvSubFolders]
                                        delete folders[k][body.formdata.gtvSubFolders]
                                    }
                                }
                            }
                        }
                        //console.log(folders)
                    } else {
                        for(let j=0;j<Stages.length;j++){
                            if(Stages[j]['Name']=='Golden Thread Vault'){
                                var folders=Stages[j]['folders']
                                for(let k=0;k<folders.length;k++){ 
                                    if(folders[k][body.formdata.gtvSubFolders]!=undefined){
                                        for(let u=0;u<folders[k][body.formdata.gtvSubFolders].length;u++){
                                            if(folders[k][body.formdata.gtvSubFolders][u]==body.formdata.subfolders){
                                                folders[k][body.formdata.gtvSubFolders][u]=body.formdata.folderName
                                            }
                                        }
                                    }
                                }
                            }
                        }  
                        //console.log(folders) 
                    }

                } else {
                    if(Stages.Name!='Golden Thread Vault'){
                        for(let i=0;i<Stages.length;i++){
                          for(let j=0;j<Stages[i].folders.length;j++)
                           if(body.formdata.stages.stage==Stages[i].Name){
                            if(body.formdata.subfolders==Stages[i].folders[j]){
                                Stages[i].folders[j]=body.formdata.folderName
                            }
                          }
                        }
                    }
                }
                //console.log(Stages)
            }
            for(let i =0;i<projects.length;i++){
                const projectData = await this.ProjectModel.findByIdAndUpdate(projects[i]._id, { $set: projects[i] }, { useFindAndModify: false }, async (error, doc) => {
                    if (error) {
                        //console.error(error);
        
                    } else {
                       // res.json({ result: 'Project Updated Successfully..', code: 200 })
                    }
                })
    
            }
            this.audittrailforEditDeleteFolders(body,user)
            res.json({ result: 'Folder Updated Successfully..', code: 200,flag:'edited' })
            
        }
    }
    async audittrailforEditDeleteFolders(body,user){
        console.log(body,user)
        if(body.type=='global'){
            const projects=await this.ProjectModel.find({})
            for(let i =0;i<projects.length;i++){
                body.selectedAssetForLocal.push(projects[i]._id)
            }
        }
        if(body.flag=='edit'){
                let temp=[]
                temp.push(body.formdata.subfolders)
                body.formdata.subfolders=temp
                var action='Folder Edited'
                var newfoldername:any = body.formdata.folderName
        } else {
                var action='Folder Deleted'
                var newfoldername:any = ''
        }
        for(let i=0;i<body.selectedAssetForLocal.length;i++){
                if(body.formdata.stages.stage=='Golden Thread Vault') body.formdata.stages.stage='GTV'
                if(body.formdata.stages.stage=='Strategic Definition') body.formdata.stages.stage=0
                if(body.formdata.stages.stage=='Preparation & Briefing') body.formdata.stages.stage=1
                if(body.formdata.stages.stage=='Concept Design') body.formdata.stages.stage=2
                if(body.formdata.stages.stage=='Spatial Coordination') body.formdata.stages.stage=3
                if(body.formdata.stages.stage=='Technical Design') body.formdata.stages.stage=4
                if(body.formdata.stages.stage=='Manufacturing & Construction') body.formdata.stages.stage=5
                if(body.formdata.stages.stage=='Handover') body.formdata.stages.stage=6
                if(body.formdata.stages.stage=='Use') body.formdata.stages.stage=7
                if(body.formdata.stages.stage=='Building Safety Manager') body.formdata.stagesstage=8
                if(body.formdata.subfolders!=null){
                for(let k=0;k<body.formdata.subfolders.length;k++){

                console.log(body.selectedAssetForLocal[i],body.formdata.stages.stage,body.formdata.subfolders[k],action)
                const userfromdb = await this.userModel.findById(user._id)
                .select('first_name last_name').lean().exec();
                const userFullName = userfromdb.first_name + ' ' + userfromdb.last_name
                const project = await this.ProjectModel.findById(body.selectedAssetForLocal[i])
                .select('ProjectName')
                const notifications = new this.NotificationModel({
                    Project: body.selectedAssetForLocal[i], stage: body.formdata.stages.stage, folder: body.formdata.subfolders[k],newname:newfoldername,
                    document: '', user: user._id, action: action,sub_role:'',
                    path:body.selectedAssetForLocal[i]+'/'+body.formdata.stages.step,status:'Folder',Projectname:project.ProjectName,Username:userFullName
                }).save()
                const dataset = new this.AudittrailModel({
                    Project: body.selectedAssetForLocal[i], stage: body.formdata.stages.stage, folder:body.formdata.subfolders[k],newname:newfoldername,
                    document: '', user: user._id, action: action
                }).save()
                }
                } else {
                    //for(let k=0;k<body.formdata.subfolders.length;k++){
                        //console.log(body.selectedAssetForLocal[i],body.formdata.stages.stage,body.formdata.subfolders[k],action)
                        const userfromdb = await this.userModel.findById(user._id)
                        .select('first_name last_name').lean().exec();
                        const userFullName = userfromdb.first_name + ' ' + userfromdb.last_name
                        const project = await this.ProjectModel.findById(body.selectedAssetForLocal[i])
                        .select('ProjectName')
                        const notifications = new this.NotificationModel({
                            Project: body.selectedAssetForLocal[i], stage: body.formdata.stages.stage, folder: body.formdata.gtvSubFolders,newname:newfoldername,
                            document: '', user: user._id, action: action,sub_role:'',
                            path:body.selectedAssetForLocal[i]+'/'+body.formdata.stages.step,status:'Folder',Projectname:project.ProjectName,Username:userFullName
                        }).save()
                        const dataset = new this.AudittrailModel({
                            Project: body.selectedAssetForLocal[i], stage: body.formdata.stages.stage, folder:body.formdata.gtvSubFolders,newname:newfoldername,
                            document: '', user: user._id, action: action
                        }).save()
                    //}
                }
        }
    }
    async createProject(body, user, res): Promise<any> {
        try {
            body.createdBy = user._id
            //console.log(this.StepsModel.find({}))
            const steps = await this.StepsModel.find({})
            console.log(steps.length)
            body.Stages = Defaultstages;
            console.log(Defaultstages)
            for(let j=0;j<Defaultstages.length;j++){
            for(let i=0;i<steps.length;i++){
                    //console.log("folders",steps[i]['stage'],Defaultstages[j].Name)  
                    if(steps[i]['stage']===Defaultstages[j].Name) {
                        console.log("yes",Defaultstages[j].Name)
                        Defaultstages[j].folders=steps[i]['folders']
                    } else {
                        console.log("no")
                    }    
            }
            }
            var numberOfRows= await  this.ProjectModel.find({}).estimatedDocumentCount();
            console.log("Number Of Rows="+String(numberOfRows))
            var projectName='DA'+(numberOfRows+1)+'/'+body.AssetViewName
            console.log(projectName)
            body.ProjectName=projectName
            //body.projectPermissions = typeof (body.projectPermissions) == 'string' ? JSON.parse(body.projectPermissions) : body.projectPermissions;
            //body.locked = typeof (body.locked) == 'string' ? JSON.parse(body.locked) : body.locked;
            //console.log(body.locked)
            const project = await new this.ProjectModel(body).save()
    
            // project.save().then(async users=>{
            //     for (let i = 0; i < body.locked.length; i++) {
            //         const item = body.locked[i];
            //         const lock = await this.ProjectModel.updateMany({ 'Stages.Name': item },
            //                     { $set: { 'Stages.$.locked': true } }
            //         );                                       
            //     }
            //  } );
            // for (let i = 0; i < body.projectPermissions.length; i++) {
            //     const item = body.projectPermissions[i];
            //     const user = await this.userModel.findByIdAndUpdate(item.user, {
            //         $push: {
            //             projects: { project: project._id, role: item.role, sub_role: item.sub_role, start_date:item.start_date,
            //             leave_date:item.leave_date, duration_of_access:item.duration_of_access, stages: item.permissions }
            //         }
            //     },{ useFindAndModify: false })
            // }
            
            res.status(200).json({ result: 'Project Created Successfully..', code: 200 })
        } catch (error) {
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400, error })
        }
    }

    async EditCreateDA(project, res): Promise<any> {
        try{
        const pro= await this.ProjectModel.findById(project._id).select('ProjectName').lean().exec();
        console.log("pro",pro)
        const split=pro['ProjectName'].split('/')[0]
        console.log(split)
        project.ProjectName=split+'/'+project.AssetViewName
        const projectData = await this.ProjectModel.findByIdAndUpdate(project._id, { $set: project }, { useFindAndModify: false }, async (error, doc) => {
            if (error) {
                return console.error(error);

            } else {
                res.status(200).json({ result: 'Project Updated Successfully..', code: 200 })
            }
        })
        }catch (error) {
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }
    async editAtireshStaffs(project,res){
        try{
            console.log("in config" , project)
            for (let i = 0; i < project.projectPermissions.length; i++) {
                const item = project.projectPermissions[i];
                console.log(item.stages)
                if (item._id) {
                    let user = await this.userModel.updateOne({ _id: project.user, "projects._id": item._id }, {
                        $set: {
                            "projects.$.stages": item.stages, "projects.$.project": item.project, "projects.$.role": item.role,
                            "projects.$.active": item.active,"projects.$.start_date": item.start_date,
                            "projects.$.leave_date": item.leave_date,"projects.$.duration_of_access": item.duration_of_access,
                            "projects.$.visitor_from":item.visitor_from,"projects.$.visitor_to":item.visitor_to,
                            "projects.$.freeze":item.freeze,"projects.$.viewAndDownload":item.viewAndDownload,
                        }
                    })
                } else {
                    const newEntry = await this.userModel.updateOne({ '_id': project.user }, {
                        $push: {
                            projects: {
                                project: item.project, stages: item.stages, role: item.role, start_date:item.start_date,
                                leave_date:item.leave_date, duration_of_access:item.duration_of_access, visitor_from:item.visitor_from, 
                                visitor_to:item.visitor_to,freeze:item.freeze,viewAndDownload:item.viewAndDownload
                            }
                        }
                    })
                    const user = await this.userModel.findById(project.user).select('first_name last_name email').lean().exec();
                    const pro = await this.ProjectModel.findById(item.project).select('ProjectName').lean().exec();
                    console.log("Atiresh Staff",user,pro)
                    this.sendExistingUserEmail(user,item,pro)
                }

            }
            res.status(200).json({ result: 'Atiresh Staff Updated Successfully..', code: 200 })
        } catch (error){
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }
    async editProject(project, res): Promise<any> {

        try {
            project.locked = typeof (project.locked) == 'string' ? JSON.parse(project.locked) : project.locked;
            project.projectPermissions = typeof (project.projectPermissions) == 'string' ? JSON.parse(project.projectPermissions) : project.projectPermissions;
            console.log('user', project)
            for(let i=0;i<Defaultstages.length;i++){
                const item = Defaultstages[i].Name;
                        const lock = await this.ProjectModel.updateMany({ _id: project._id,'Stages.Name': item },
                                    { $set: { 'Stages.$.locked': false } }
                        );
            }
            const projectData = await this.ProjectModel.findByIdAndUpdate(project._id, { $set: project }, { useFindAndModify: false }, async (error, doc) => {
                console.log(error);
                if (error) {
                    return console.error(error);

                } else {
                    for (let i = 0; i < project.locked.length; i++) {
                        const item = project.locked[i];
                        const lock = await this.ProjectModel.updateMany({ _id: project._id,'Stages.Name': item },
                                    { $set: { 'Stages.$.locked': true } }
                        );                                       
                    }
                    for (let i = 0; i < project.projectPermissions.length; i++) {
                        const item = project.projectPermissions[i];
                        if (item._id) {
                            let user = await this.userModel.updateOne({ _id: item.user, "projects._id": item._id }, {
                                $set: {
                                    "projects.$.stages": item.permissions, "projects.$.project": project._id, "projects.$.role": item.role,
                                    "projects.$.active": item.active,"projects.$.sub_role": item.sub_role,"projects.$.start_date": item.start_date,
                                    "projects.$.leave_date": item.leave_date,"projects.$.duration_of_access": item.duration_of_access,
                                    "projects.$.visitor_from":item.visitor_from,"projects.$.visitor_to":item.visitor_to,
                                    "projects.$.freeze":item.freeze,"projects.$.viewAndDownload":item.viewAndDownload
                                }
                            })
                            //console.log("deleted",item)
                            if(item.deleted==true){
                                const usertoDelete = await this.userModel.findById(item.user).select('first_name last_name email').lean().exec();
                                const pro = await this.ProjectModel.findById(project._id).select('ProjectName AssetViewName').lean().exec();
                                console.log("delete",usertoDelete,pro)
                                this.sendDisableUserEmail(usertoDelete,pro)
                            }
                        } else {
                            const newEntry = await this.userModel.updateOne({ '_id': item.user }, {
                                $push: {
                                    projects: {
                                        project: project._id, stages: item.permissions, role: item.role,sub_role: item.sub_role, start_date:item.start_date,
                                        leave_date:item.leave_date, duration_of_access:item.duration_of_access, visitor_from:item.visitor_from, 
                                        visitor_to:item.visitor_to,freeze:item.freeze,viewAndDownload:item.viewAndDownload
                                    }
                                }
                            })
                            const user = await this.userModel.findById(item.user).select('first_name last_name email').lean().exec();
                            console.log("send email",user,item)
                            this.sendExistingUserEmail(user,item,project)

                        }

                    }
                    res.status(200).json({ result: 'Project Updated Successfully..', code: 200 })
                }
            })
        } catch (error) {
            console.log(error)
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }


    async deleteProject(project, res): Promise<any> {
        try {
            const projectData = this.ProjectModel.findByIdAndUpdate(project._id, { active_flag: false }, { useFindAndModify: false }, async (error, doc) => {
                console.log(error);
                if (error) {
                    return console.error(error);
                } else {
                    const usermodel = await this.userModel.updateMany({ 'projects.project': project._id },
                        { $set: { 'projects.$.active': false } }
                    );
                    console.log(usermodel)
                    return 'Project Deleted successfully..'
                }
            })
            res.status(200).json({ result: 'Project Deleted successfully..', code: 200 })
        } catch (error) {
            res.json({ result: 'Error Occured..', code: 400 })
        }
    }

    async updateStageProgress(body, res) {
        try {
            console.log(body[1].stages);
            body[1].stages.forEach(async stage => {
                console.log(isNaN(stage.start_date),stage.start_date,typeof(stage.start_date))
                if(stage.start_date=='NaN-NaN-NaN'){
                    //console.log("yes")
                    stage.start_date=null
                }
                if(stage.end_date=="NaN-NaN-NaN"){
                    //console.log("yes end date")
                    stage.end_date=null
                }
                console.log(new Date('NaN-NaN-NaN'))
                await this.ProjectModel.updateOne({ _id: Types.ObjectId(body[0].project), 'Stages.Order': Number(stage.Order) },
                    {
                        'Stages.$.start_date': stage.start_date, 'Stages.$.end_date': stage.end_date,
                        'Stages.$.progress': Number(stage.progress)
                    })
            });
            res.status(200).json({ result: 'Updated Successfully..', code: 200 });
        } catch (error) {
            console.error(error);
            res.json({ result: 'Error Occured..', code: 400 });
        }
    }

    async getStageProgress(body) {
        console.log(body)
        try {
            const stage = await this.ProjectModel.aggregate([{
                $match: { _id: Types.ObjectId(body.project) }
            }, {
                $project: {
                    Stages: {
                        $filter: {
                            input: '$Stages',
                            as: 'st',
                            cond: { $eq: ['$$st.Order', Number(body.stage)] }

                        }
                    }
                }
            }, {
                $group: { _id: '$_id', start_date: { $first: '$Stages.start_date' }, end_date: { $first: '$Stages.end_date' }, progress: { $first: '$Stages.progress' } }
            }, { $unwind: '$start_date' }, { $unwind: '$end_date' }, { $unwind: '$progress' }
            ])
            return stage[0]
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async getProjectbyUserReport(body): Promise<any> {
        console.log(body)
        try {

            const projectPermissions = await this.userModel.aggregate([{
                $match: { 'projects.project': Types.ObjectId(body.project) }
            },
            { $lookup: { from: 'steps', localField: 'projects.stages', foreignField: '_id', as: 'Stages' } },
            {
                $project: {
                    first_name: {
                        $concat: ["$first_name", " ", "$last_name"],
                    },
                    Stages: 1,
                    projects:
                    {
                        $filter: {
                            input: '$projects',
                            as: 'pro',
                            cond: { $eq: ['$$pro.project', Types.ObjectId(body.project)] }
                        }
                    }
                }
            }
                , {
                $group: {
                    _id: '$_id', stages: { $first: '$Stages.step' }, user_name: { $first: '$first_name' }
                }
            },
            { $unwind: '$_id' }
            ])

            return projectPermissions
        } catch (error) {
            return console.error(error);
        }
    }

    async getProjectUsedSpace(body): Promise<any> {
        try {
            console.log(body)
            const self = this;
            const dirPath = join(__dirname, '../Uploads')
            console.log(dirPath)
            if (existsSync(dirPath)) {
                const arrayOfFiles = await self.getAllFiles(dirPath, [])
                let totalSize = 0

                arrayOfFiles.forEach(function (filePath) {
                    totalSize += statSync(filePath).size
                })
                const size = totalSize * 0.000000001;
                return size.toFixed(2)
            } else return 0.00;

        } catch (error) {
            console.log(error)
            return console.error(error);
        }
    }

    async getAllFiles(dirPath, arrayOfFiles): Promise<[]> {
        const self = this;
        const files = readdirSync(dirPath)
        arrayOfFiles = arrayOfFiles || []
        console.log("hiiiiiiiiiiiiiiiiiiiii",dirPath,files)
        files.forEach(async (file) => {
            if (statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = await self.getAllFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                arrayOfFiles.push(join(dirPath, file))
            }
        })

        return arrayOfFiles
    }

    async getClientOverViewReport(body): Promise<any> {
        let today=new Date()
        try {
            console.log(body.client)
            const condition = body.client == null ? {} : { $match: { Client: Types.ObjectId(body.client) } }
            const Dataset = await this.ProjectModel.aggregate([condition,
                { $lookup: { from: 'clients', localField: 'Client', foreignField: '_id', as: 'cli' } },
                {
                    $group: {
                        _id: '$_id', name: { $first: '$cli.name' }, Project: { $first: '$ProjectName' }
                    }
                }, { $unwind: '$name' }, { $unwind: '$Project' }
            ]).sort({ Project: 'asc' })
            Dataset.forEach(async (item) => {
                const sto = { project: item._id }
                item.le_Date = new Date('12-31-2022');
                item.ls_Date = new Date('01-01-2022');
                item.Storage = await this.getProjectUsedSpace(sto);
                item.fsc_date = new Date('10-01-2022');
                item.bsm_date = new Date('11-30-2022');
                item.weeks= (item.bsm_date.getTime()-today.getTime())/7
            })
            return Dataset
        } catch (error) {
            return console.error(error);
        }
    }


    async getAllprojectOverViewReport(body): Promise<any> {
        try {
            console.log(body.client)
            // const condition = body.client == null ? {} : { $match: { Client: Types.ObjectId(body.client) } }
            const Dataset = await this.ProjectModel.aggregate([
                //{ $lookup: { from: 'clients', localField: 'Client', foreignField: '_id', as: 'cli' } },
                // certificate_of_completion_date BuildingRegistrationDate FscDate
                {
                    $group: {
                        _id: '$_id', Project: { $first: '$ProjectName' },
                        Active: { $first: '$active_flag' },ls_Date:{$first:'$development_license_start_date'},
                        le_Date:{$first:'$development_license_end_date'},pdls_Date:{$first:'$post_development_license_start_date'},
                        pdle_Date:{$first:'$post_development_license_end_date'},fsc_Date:{$first:'$FscDate'},
                        br_Date:{$first:'$BuildingRegistrationDate'},cc_Date:{$first:'$certificate_of_completion_date'},
                        created_at:{$first:'$created_at'},data_storage:{$first:'$data_storage'}
                    }
                }, { $unwind: '$Project' }
            ]).sort({ Project: 'asc' })
            Dataset.forEach(async (item) => {
                const sto = { project: item._id }
                // item.le_Date = new Date('12-31-2022');
                // item.ls_Date = new Date('01-01-2022');
                item.Storage = await this.getProjectUsedSpace(sto);
                //item.fsc_date = new Date('10-01-2022');
                item.bsm_date = new Date('11-30-2022');
                console.log("Dateeeeeeeee",item.bsm_date.getTime())
                item.weeks= Math.trunc((item.bsm_date.getTime()-new Date().getTime())/604800000)
                console.log(item.weeks)
            })
            return Dataset
        } catch (error) {
            return console.error(error);
        }
    }
    async getAuditTrailReport(body): Promise<any> {
        try {
            console.log("body",body)
            const Dataset = await this.AudittrailModel.aggregate([
                {
                    $match: {
                        created_at: {
                            $gte: new Date(body.from),
                            $lte: new Date(body.to)
                        },
                        Project: Types.ObjectId(body.project),
                        action : {$nin : ["Folder Created","Folder Deleted","Folder Edited"]}
                        //client: Types.ObjectId(body.client)
                    }
                },
                { $lookup: { from: 'projects', localField: 'Project', foreignField: '_id', as: 'pro' } },
                { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
               // { $lookup: { from: 'clients', localField: 'client', foreignField: '_id', as: 'cli' } },
                {
                    $group: {
                        _id: '$_id', user: { $first: '$user.first_name' }, user_last:{$first:"$user.last_name"}, project: { $first: '$pro.ProjectName' },
                        Stage: { $first: '$stage' }, folder: { $first: '$folder' }, document: { $first: '$document' },
                        date: { $first: '$created_at' }, action: { $first: '$action' }, sub_role:{$first: '$sub_role'},
                        company:{$first:'$user.company'},email:{$first:'$user.email'}
                    }
                }, { $unwind: '$user' }, { $unwind: '$project' } , {$unwind: '$email'}, {$unwind:'$company'},{$unwind: '$user_last'}
            ]).sort({ date: 'desc' })
            return Dataset
        } catch (error) {
            return console.error(error);
        }
    }

    async getFolderLogReport(body): Promise<any> {
        try {
            console.log("body",body)
            const Dataset = await this.AudittrailModel.aggregate([
                {
                    $match: {
                        created_at: {
                            $gte: new Date(body.from),
                            $lte: new Date(body.to)
                        },
                        Project: Types.ObjectId(body.project),
                        action : {$in : ["Folder Created","Folder Deleted","Folder Edited"]}
                        //client: Types.ObjectId(body.client)
                    }
                },
                { $lookup: { from: 'projects', localField: 'Project', foreignField: '_id', as: 'pro' } },
                { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
               // { $lookup: { from: 'clients', localField: 'client', foreignField: '_id', as: 'cli' } },
                {
                    $group: {
                        _id: '$_id', user: { $first: '$user.first_name' }, user_last:{$first:"$user.last_name"}, project: { $first: '$pro.ProjectName' },
                        Stage: { $first: '$stage' }, folder: { $first: '$folder' },newname:{$first:"$newname"}, document: { $first: '$document' },
                        date: { $first: '$created_at' }, action: { $first: '$action' }, sub_role:{$first: '$sub_role'},
                        company:{$first:'$user.company'},email:{$first:'$user.email'}
                    }
                }, { $unwind: '$user' }, { $unwind: '$project' } , {$unwind: '$email'}, {$unwind:'$company'},{$unwind: '$user_last'}
            ]).sort({ date: 'desc' })
            return Dataset
        } catch (error) {
            return console.error(error);
        }
    }

    async getUserLogReport(body): Promise<any> {
        try {
            console.log("body",body.dataset.type)
            const Dataset = await this.userModel.aggregate([{
                $match: { 
                    created_at: {
                                $gte: new Date(body.dataset.from),
                                $lte: new Date(body.dataset.to)
                            },
                    type: String(body.dataset.type),
                    'projects.project': Types.ObjectId(body.dataset.project),
                    'projects.active' :true }
            },
            {
                $project: {
                    first_name: 1,
                    last_name:1,
                    created_at:1,
                    company:1,
                    role:1,
                    email:1,
                    projects:
                    {
                        $filter: {
                            input: '$projects',
                            as: 'pro',
                            cond: {
                                $and: [
                                    { $eq: ['$$pro.project', Types.ObjectId(body.dataset.project)] },
                                    { $eq: ['$$pro.active', true] }
                                ]
                            }

                        }
                    }
                }
            }, {
                $group: {
                    // _id: '$projects._id', user: { $first: '$_id' }, role: { "$first": '$projects.role' },
                    // permissions: { $first: '$projects.stages' }, active: { "$first": '$projects.active' },
                    // sub_role: { "$first": '$projects.sub_role' }, duration_of_access: {"$first": '$projects.duration_of_access'} , 
                    // start_date: {"$first": '$projects.start_date'} , leave_date:{"$first": '$projects.leave_date'}
                        _id: '$_id', first_name: { $first: '$first_name' }, last_name: { $first: '$last_name' },
                        created_at: { $first: '$created_at' }, company: { $first: '$company' }, email:{$first:'$email'}, role:{ $first:'$projects.role' },
                        sub_role:{$first:'$projects.sub_role'},duration_of_access:{$first:'$projects.duration_of_access'},
                        leaveDate:{ $first:'$projects.leave_date' }
                }
            },
                // {
                //     $match: {
                //         // created_at: {
                //         //     $gte: new Date(body.dataset.from),
                //         //     $lte: new Date(body.dataset.to)
                //         // },
                //         'projects.project': Types.ObjectId(body.dataset.project) ,
                //         'active':true
                //     }
                    
                // },
                // {
                //     $group: {
                //         _id: '$_id', first_name: { $first: '$first_name' }, last_name: { $first: '$last_name' },
                //         created_at: { $first: '$created_at' }, company: { $first: '$company' }, role:{ $first:'$role' },
                //         leaveDate:{ $first:'$leaveDate' }
                //     }
                // }  
                // { $unwind: '$first_name' }, { $unwind: '$Last_name' },{ $unwind: '$created_at' }, { $unwind: '$company' },
                // { $unwind: '$role' }, { $unwind: '$leaveDate' }
            ]).sort({ date: 'desc' })
            if (body.dataset.type=='AtireshStaff'){
                const masterAdminData=await this.userModel.aggregate([{
                    $match: { 
                        created_at: {
                                    $gte: new Date(body.dataset.from),
                                    $lte: new Date(body.dataset.to)
                                },
                        type: 'SuperAdmin',
                        'projects.project': Types.ObjectId(body.dataset.project),
                        'projects.active' :true }
                }, {
                    $project: {
                        first_name: 1,
                        last_name:1,
                        created_at:1,
                        company:1,
                        role:1,
                        projects:
                        {
                            $filter: {
                                input: '$projects',
                                as: 'pro',
                                cond: {
                                    $and: [
                                        { $eq: ['$$pro.project', Types.ObjectId(body.dataset.project)] },
                                        { $eq: ['$$pro.active', true] }
                                    ]
                                }
    
                            }
                        }
                    }
                }, {
                    $group: {
                        // _id: '$projects._id', user: { $first: '$_id' }, role: { "$first": '$projects.role' },
                        // permissions: { $first: '$projects.stages' }, active: { "$first": '$projects.active' },
                        // sub_role: { "$first": '$projects.sub_role' }, duration_of_access: {"$first": '$projects.duration_of_access'} , 
                        // start_date: {"$first": '$projects.start_date'} , leave_date:{"$first": '$projects.leave_date'}
                            _id: '$_id', first_name: { $first: '$first_name' }, last_name: { $first: '$last_name' },
                            created_at: { $first: '$created_at' }, company: { $first: '$company' }, role:{ $first:'$projects.role' },
                            sub_role:{$first:'$projects.sub_role'},duration_of_access:{$first:'$projects.duration_of_access'},
                            leaveDate:{ $first:'$projects.leave_date' }
                    }
                },

                ]).sort({ date: 'desc' })
                console.log(masterAdminData)
                for(let i=0;i<masterAdminData.length;i++)
                Dataset.push(masterAdminData[i])
            }
            console.log("datasetss",Dataset)
            return Dataset
        } catch (error) {
            return console.error(error);
        }
    }
    async getProjectByClient(body): Promise<any> {
        try {
            const projects = await this.ProjectModel.find({ Client: body.client })
                .select(' ProjectName').lean().exec();
            return projects
        } catch (error) {
            console.log(error)
            return error
        }

    }
    async sendExistingUserEmail(user,details,project) {
        try {
            console.log("sendEmail............",project)
            console.log(details.duration_of_access)
            if(details.duration_of_access=='Ongoing'){
                var text='on an ongoing basis'
            } else {
                console.log(new Date(details.visitor_to).toLocaleDateString("en-GB"))
                var text='until '+new Date(details.visitor_to).toLocaleDateString("en-GB")               
            }
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: user.email, // list of receivers
                subject: "Digital Asset Invitation", // Subject line
                html: `<p>Dear ${user.first_name},</p>
                <p> You are receiving this email as you have been granted access to an additional Digital Asset, named ${project.AssetViewName}.Your access is ${text}.</p> 
                <p>
                Please login as usual to view this additional Digital Asset on your Asset Dashboard. 
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
    async sendDisableUserEmail(user,project) {
        try {
            console.log("sendEmail............")
            
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: user.email, // list of receivers
                subject: "Digital Asset Invitation", // Subject line
                html: `<p>Dear ${user.first_name},</p>
                <p>  
                You are receiving this email as you have now left the ${project.AssetViewName} project and,
                 therefore, your access to the Digital Asset has been disabled with immediate effect.
                </p>
                <p>
                If you think you have received this email in error, contact the Atiresh team on the number
                 below and please do not respond to this email as it has been auto generated from the software 
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
