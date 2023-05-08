import { FilesService } from './files.service';
import {
    Controller, Post, UseGuards, Request, UploadedFile,
    UseInterceptors,
    Body,
    Get,
    Param,
    Res,
    BadRequestException,
    HttpException,
    HttpStatus,
    UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { SampleDto } from './sample.dto';
import { multerOptions, UploadLogo, UploadNonMandatoryDocs, UploadUserImage,UploadMandatoryDocs,UploadMajorDocs, UploadNonMajorDocs, uploadMajorPdf, uploadNonMajorPdf, UploadKbir4Docs, UploadKbir5Docs, uploadKbir4Attachment, uploadKbir5Attachment } from 'src/config/multer.config';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { diskStorage } from 'multer';


@Controller('files')
export class FilesController {
    constructor(private _Fileservice: FilesService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/Uploadfiles')
    getProjects(@Request() req) {
        console.log(req.body)
        return
    }
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @Post('UploadStageFiles')
    uploadFile(
        @Body() body: SampleDto,
        @UploadedFile() file: Express.Multer.File,
        @Request() req
    ) {
        console.log("activity log",req.body)
        console.log(`${req.body.project}${req.body.path}`)
        req.body.path=`${req.body.project}${req.body.path}`
        return this._Fileservice.fnSaveAudittrail(req);
    }
    
    @Post('updateFileUploadNotification')
    updateFileUpload(@Request() req, @Res() res) {
        console.log('notifAction',req.body)
        return this._Fileservice.updateFileUploadNotification(req.body,res)
    }
    @Post('GetStageFiles')
    getFiles(@Request() req) {
        return this._Fileservice.fnGetFilesBypath(req)
    }
    
    @Post('postMandatoryReportForm')
    @UseInterceptors(
    FilesInterceptor('mandatoryDocuments[]', 20, UploadMandatoryDocs))
    createMOR(@Request() req, @Res() res,@UploadedFiles() files){
        console.log("request",req.body)
        // req.body.filename='Mandatory Occurrence Report'
        // req.body.action='created'
        let uploadedfiles =[]
        for (let i in files){
            uploadedfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        console.log("file array",uploadedfiles)
        req.body.mandatoryDocuments=uploadedfiles
        delete req.body._id;
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.postMorFormDetails(req.body,res)
    }
    @Post('postNonMandatoryReportForm')
    @UseInterceptors(
    FilesInterceptor('nonMandatoryDocuments[]', 20, UploadNonMandatoryDocs))
    createNMOR(@Request() req , @Res() res ,@UploadedFiles() files ){
        //console.log('Mor body', req.body)
        console.log("files",files)
        let uploadedfiles =[]
        for (let i in files){
            uploadedfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        console.log("file array",uploadedfiles)
        req.body.nonMandatoryDocuments=uploadedfiles
        delete req.body._id;
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.postNMorFormDetails(req.body,res)
    }
    @Post('postKbir4Form')
    @UseInterceptors(
    FilesInterceptor('kbir4Documents[]', 20, UploadKbir4Docs))
    createKBIR(@Request() req, @Res() res,@UploadedFiles() files){
        console.log("request",req.body)
        let uploadedfiles =[]
        for (let i in files){
            uploadedfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        console.log("file array",uploadedfiles)
        req.body.kbir4Documents=uploadedfiles
        delete req.body._id;
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.postKbir4Details(req.body,res)
    }
    @Post('postKbir5Form')
    @UseInterceptors(
    FilesInterceptor('kbir5Documents[]', 20, UploadKbir5Docs))
    createKBIR5(@Request() req, @Res() res,@UploadedFiles() files){
        console.log("request",req.body)
        let uploadedfiles =[]
        for (let i in files){
            uploadedfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        console.log("file array",uploadedfiles)
        req.body.kbir5Documents=uploadedfiles
        delete req.body._id;
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.postKbir5Details(req.body,res)
    }
    @Post('postMajorChangeControlForm')
    @UseInterceptors(
    FilesInterceptor('majorDocuments[]', 20, UploadMajorDocs))
    createMajorChangeControl(@Request() req, @Res() res,@UploadedFiles() files){
        console.log("request",req.body)
        let uploadedfiles =[]
        for (let i in files){
            uploadedfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        console.log("file array",uploadedfiles)
        req.body.majorDocuments=uploadedfiles
        delete req.body._id;
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.postMajorChangeControlFormDetails(req.body,res)
    }
    @Post('postNonMajorChangeControlForm')
    @UseInterceptors(
    FilesInterceptor('nonMajorDocuments[]', 20, UploadNonMajorDocs))
    createNonMajorChangeControl(@Request() req, @Res() res,@UploadedFiles() files){
        console.log("request",req.body)
        let uploadedfiles =[]
        for (let i in files){
            uploadedfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        console.log("file array",uploadedfiles)
        req.body.nonMajorDocuments=uploadedfiles
        delete req.body._id;
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.postNonMajorChangeControlFormDetails(req.body,res)
    }
    @Post('updateMandatoryReportForm')
    @UseInterceptors(
    FilesInterceptor('mandatoryDocuments[]', 20, UploadMandatoryDocs))
    updateMOR(@Request() req, @Res() res,@UploadedFiles() files){
        let existingfiles =[]
        if('existingMandatoryDocuments' in req.body){
            if(typeof req.body.existingMandatoryDocuments === 'string'){
                existingfiles.push(JSON.parse(req.body.existingMandatoryDocuments))
            } else {
                for(let i in req.body.existingMandatoryDocuments){
                existingfiles.push(JSON.parse(req.body.existingMandatoryDocuments[i]))
            }
        }      
        } 
        for (let i in files){
                existingfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        req.body.mandatoryDocuments=existingfiles
        console.log("file array",req.body.mandatoryDocuments)
        delete req.body.existingMandatoryDocuments
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.UpdateMor(req,res)
    }

    @Post('updateNonMandatoryReportForm')
    @UseInterceptors(
    FilesInterceptor('nonMandatoryDocuments[]', 20, UploadNonMandatoryDocs))
    updateNMOR(@Request() req, @Res() res,@UploadedFiles() files){
        let existingfiles =[]
        if('existingNonMandatoryDocuments' in req.body){
            if(typeof req.body.existingNonMandatoryDocuments === 'string'){
                existingfiles.push(JSON.parse(req.body.existingNonMandatoryDocuments))
            } else {
                for(let i in req.body.existingNonMandatoryDocuments){
                existingfiles.push(JSON.parse(req.body.existingNonMandatoryDocuments[i]))
            }
        }      
        } 
        for (let i in files){
                existingfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        req.body.nonMandatoryDocuments=existingfiles
        console.log("file array",req.body.nonMandatoryDocuments)
        delete req.body.existingMandatoryDocuments
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.UpdateNMor(req,res)

    }
    @Post('updateMajorChangeControlForm')
    @UseInterceptors(
    FilesInterceptor('majorDocuments[]', 20, UploadMajorDocs))
    updateMajorChangeControl(@Request() req, @Res() res,@UploadedFiles() files){
        console.log(req.body)
        let existingfiles =[]
        if('existingMajorDocuments' in req.body){
            if(typeof req.body.existingMajorDocuments === 'string'){
                existingfiles.push(JSON.parse(req.body.existingMajorDocuments))
            } else {
                for(let i in req.body.existingMajorDocuments){
                existingfiles.push(JSON.parse(req.body.existingMajorDocuments[i]))
            }
        }      
        } 
        for (let i in files){
                existingfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        req.body.majorDocuments=existingfiles
        console.log("file array",req.body.majorDocuments)
        delete req.body.existingMajorDocuments
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.UpdateMajor(req,res)

    }
    @Post('updateNonMajorChangeControlForm')
    @UseInterceptors(
    FilesInterceptor('nonMajorDocuments[]', 20, UploadNonMajorDocs))
    updateNonMajorChangeControl(@Request() req, @Res() res,@UploadedFiles() files){
        console.log(req.body)
        let existingfiles =[]
        if('existingNonMajorDocuments' in req.body){
            if(typeof req.body.existingNonMajorDocuments === 'string'){
                existingfiles.push(JSON.parse(req.body.existingNonMajorDocuments))
            } else {
                for(let i in req.body.existingNonMajorDocuments){
                existingfiles.push(JSON.parse(req.body.existingNonMajorDocuments[i]))
            }
        }      
        } 
        for (let i in files){
                existingfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        req.body.nonMajorDocuments=existingfiles
        console.log("file array",req.body.nonMajorDocuments)
        delete req.body.existingNonMajorDocuments
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.UpdateNMajor(req,res)

    }
    @Post('updatekbir4Form')
    @UseInterceptors(
    FilesInterceptor('kbir4Documents[]', 20, UploadKbir4Docs))
    updateKbir4Form(@Request() req, @Res() res,@UploadedFiles() files){
        console.log(req.body)
        let existingfiles =[]
        if('existingKbir4Documents' in req.body){
            if(typeof req.body.existingKbir4Documents === 'string'){
                existingfiles.push(JSON.parse(req.body.existingKbir4Documents))
            } else {
                for(let i in req.body.existingMajorDocuments){
                existingfiles.push(JSON.parse(req.body.existingKbir4Documents[i]))
            }
        }      
        } 
        for (let i in files){
                existingfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        req.body.kbir4Documents=existingfiles
        console.log("file array",req.body.existingKbir4Documents)
        delete req.body.existingKbir4Documents
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.UpdateKbirStage4(req,res)

    }
    @Post('updatekbir5Form')
    @UseInterceptors(
    FilesInterceptor('kbir5Documents[]', 20, UploadKbir4Docs))
    updateKbir5Form(@Request() req, @Res() res,@UploadedFiles() files){
        console.log(req.body)
        let existingfiles =[]
        if('existingKbir5Documents' in req.body){
            if(typeof req.body.existingKbir5Documents === 'string'){
                existingfiles.push(JSON.parse(req.body.existingKbir5Documents))
            } else {
                for(let i in req.body.existingKbir5Documents){
                existingfiles.push(JSON.parse(req.body.existingKbir5Documents[i]))
            }
        }      
        } 
        for (let i in files){
                existingfiles.push({"filename":files[i].filename , "originalname":files[i].originalname})
        }
        req.body.kbir5Documents=existingfiles
        console.log("file array",req.body.existingKbir5Documents)
        delete req.body.existingKbir5Documents
        const otherFeaturesAudittrail=this._Fileservice.otherFeaturesAudittrail(req)
        return this._Fileservice.UpdateKbirStage5(req,res)

    }
    @Post('updateMorDateSentToBsr')
    upadateMorDateBsr(@Request() req , @Res() res){
        console.log("MorBsrDate",req.body)
        return this._Fileservice.updateMorBsrDate(req,res)
    }
    @Post('updateMajorCclDateSentToBsr')
    updateMajorCclDateSentToBsr(@Request() req , @Res() res){
        console.log("MorBsrDate",req.body)
        return this._Fileservice.updateMajorBsrDate(req,res)
    }
    @Post('updateNonMajorDateSentToBsr')
    updateNonMajorCclDateSentToBsr(@Request() req , @Res() res){
        console.log("nonmajorBsrDate",req.body)
        return this._Fileservice.updateNonMajorBsrDate(req,res)
    }
    
    @Post('updateNmorDateSentToBsr')
    upadateNmorDateBsr(@Request() req , @Res() res){
        console.log("NmorBsrDate",req.body)
        return this._Fileservice.updateNmorBsrDate(req,res)
    }
    @Post('updateMajorCclApproveStatus')
    upadateMajorCclApproveStatus(@Request() req , @Res() res){
        console.log("MorBsrDate",req.body)
        return this._Fileservice.updateMajorApproveStatus(req,res);
    }
    @Post('updateMajorApprovedDate')
    updateMajorApprovedDate(@Request() req , @Res() res){
        console.log("MorBsrDate",req.body)
        return this._Fileservice.updateMajorApproveDate(req,res);
    }
    @Post('uploadMajorBsrResponsePdf')
    @UseInterceptors(FileInterceptor('file', uploadMajorPdf))
    uploadMajorBsrResponsePdf(@Request() req , @Res() res,@UploadedFile() file){
        console.log("files",file)
        let existingfiles=[]
        existingfiles.push({"filename":file.filename , "originalname":file.originalname})      
        req.body.pdf_of_bsr_response=existingfiles
        return this._Fileservice.updateMajorBsrPdf(req,res)
    }
    @Post('uploadMajorBsrResponseVariationPdf')
    @UseInterceptors(FileInterceptor('file', uploadMajorPdf))
    uploadMajorBsrResponseVariationPdf(@Request() req , @Res() res,@UploadedFile() file){
        console.log("files",file)
        let existingfiles=[]
        existingfiles.push({"filename":file.filename , "originalname":file.originalname})      
        req.body.pdf_of_bsr_response_variations=existingfiles
        return this._Fileservice.updateMajorBsrVariationPdf(req,res)
    }
    @Post('updateNonMajorCclApproveStatus')
    upadateNonMajorCclApproveStatus(@Request() req , @Res() res){
        console.log("MorBsrDate",req.body)
        return this._Fileservice.updateNonMajorApproveStatus(req,res);
    }
    @Post('updateNonMajorApprovedDate')
    updateNonMajorApprovedDate(@Request() req , @Res() res){
        console.log("MorBsrDate",req.body)
        return this._Fileservice.updateNonMajorApproveDate(req,res);
    }
    @Post('uploadNonMajorBsrResponsePdf')
    @UseInterceptors(FileInterceptor('file', uploadNonMajorPdf))
    uploadNonMajorBsrResponsePdf(@Request() req , @Res() res,@UploadedFile() file){
        console.log("files",file)
        let existingfiles=[]
        existingfiles.push({"filename":file.filename , "originalname":file.originalname})      
        req.body.pdf_of_bsr_response=existingfiles
        return this._Fileservice.updateNonMajorBsrPdf(req,res)
    }
    //deleteKbirAttachments

    @Post('deleteKbirAttachments')
    deleteKbir4Attachement(@Request() req , @Res() res){
        if(req.body.report_type=='KBIR5'){
        const existingAttachments=this._Fileservice.getExistingKbir5Attachments(req.body._id).then(value =>{
            for(let i in value.kbir5Attachments){
                if(value.kbir5Attachments[i].filename==req.body.filename){
                    value.kbir5Attachments.splice(i,1)
                }
            }
            console.log(value)
            return this._Fileservice.deleteKbir5Attachments(value,req,res)
        })
        } if (req.body.report_type=='KBIR4'){
            const existingAttachments=this._Fileservice.getExistingKbir4Attachments(req.body._id).then(value =>{
                console.log(req.body,value)
                for(let i in value.kbir4Attachments){
                    if(value.kbir4Attachments[i].filename==req.body.filename){
                        value.kbir4Attachments.splice(i,1)
                    }
                }
                console.log(value)
                return this._Fileservice.deleteKbir4Attachments(value,req,res)
            })
            
        }
    }



    @Post('uploadKbir4Attachement')
    @UseInterceptors(FileInterceptor('file', uploadKbir4Attachment))
    uploadKbir4Attachement(@Request() req , @Res() res,@UploadedFile() file){
        console.log("files",file , req.body)
        const existingAttachments=this._Fileservice.getExistingKbir4Attachments(req.body._id).then(value =>{
            let attachments=[]
            attachments=value.kbir4Attachments
            attachments.push({"filename":file.filename , "originalname":file.originalname})
            req.body.kbir4Attachments=attachments
            console.log(req.body)
            return this._Fileservice.uploadKbir4FileAttachment(req,res)
        })
    }
    @Post('uploadKbir5Attachement')
    @UseInterceptors(FileInterceptor('file', uploadKbir5Attachment))
    uploadKbir5Attachement(@Request() req , @Res() res,@UploadedFile() file){
        console.log("files",file , req.body)
        const existingAttachments=this._Fileservice.getExistingKbir5Attachments(req.body._id).then(value =>{
            let attachments=[]
            attachments=value.kbir5Attachments
            attachments.push({"filename":file.filename , "originalname":file.originalname})
            req.body.kbir5Attachments=attachments
            console.log(req.body)
            return this._Fileservice.uploadKbir5FileAttachment(req,res)
        })
    }
    @Post('getMandatoryReportList')
    getMORDetails(@Request() req){
        console.log("bodyyyy",req.body)
        return this._Fileservice.getAllMorDetails(req.body)
    }
    @Post('getMajorChangeControlList')
    getMajorChangeControlDetails(@Request() req){
        return this._Fileservice.getMajorChangeControlList(req.body)
    }
    @Post('getKbir4List')
    getkbir4Details(@Request() req){
        return this._Fileservice.getKbir4List(req.body)
    }
    @Post('getKbir5List')
    getkbir5Details(@Request() req){
        return this._Fileservice.getKbir5List(req.body)
    }
    @Post('getNonMajorChangeControlList')
    getNonMajorChangeControlDetails(@Request() req){
        return this._Fileservice.getNonMajorChangeControlList(req.body)
    }
    @Post('getNonMandatoryReportList')
    getNMORDetails(@Request() req ){
        return this._Fileservice.getAllNMorDetails(req.body)
    }

    @Post('/getMandatoryReportById')
    getMandatoryReportById(@Request() req) {
        return this._Fileservice.getMandatoryReportById(req.body._id)
    }

    @Post('/getNonMandatoryReportById')
    getNonMandatoryReportById(@Request() req) {
        return this._Fileservice.getNonMandatoryReportById(req.body._id)
    }
    @Post('/getMajorChangeControlListById')
    getMajorChangeControlListById(@Request() req) {
        return this._Fileservice.getMajorChangeControlById(req.body._id)
    }

    @Post('/getNonMajorChangeControlListById')
    getNonMajorChangeControlListById(@Request() req) {
        return this._Fileservice.getNonMajorChangeControlById(req.body._id)
    }
    @Post('/getKbir4ListById')
    getKbir4ById(@Request() req) {
        return this._Fileservice.getKbir4ListById(req.body._id)
    }
    @Post('/getKbir5ListById')
    getKbir5ById(@Request() req) {
        return this._Fileservice.getKbir5ListById(req.body._id)
    }
    @UseGuards(JwtAuthGuard)
    @Post('CreateFolder')
    CreateFolder(@Request() req) {
        try {
            const result = this._Fileservice.mkDirByPathSync(join(__dirname, '../Uploads/', req.body.path), { isRelativeToScript: true })
            console.log(result);
            return this._Fileservice.fnSaveAudittrailPath(req);
        } catch (error) {
            return error
        }

    }

    @Post('DeleteFolder')
    DeleteFolder(@Request() req) {
        const path = join(__dirname, '../' + req.body.path);
        // console.log(path)
        return this._Fileservice.removeDir(path)
    }

    @Post('DeleteFile')
    DeleteFile(@Request() req) {
        try {
            const path = join(__dirname, '../' + req.body.path);
            return this._Fileservice.removeFile(path)
        } catch (error) {
            console.log(error)
            return error
        }

    }

    @Post('DownloadFile')
    DownloadFile(@Request() req, @Res() res) {
        try {
            const path = join(__dirname, '../' + req.body.path)
            console.log(path)
            if (existsSync(path)) {
                console.log(path)
                const file = createReadStream(path);
                file.pipe(res);
            } else {
                console.log(false)
                res.status(400).send(false)
            }

        } catch (error) {
            console.log(error)
            return error
        }

    }
    @Post('downloadReport')
    downloadReportAsPdf(@Request() req, @Res() res){
        console.log("req",req.body)
        if(req.body.data[2].type=='CCL'){
            return this._Fileservice.getCCLPdf(req.body,res)
        }
        if(req.body.data[2].type=='KBIR5'){
            return this._Fileservice.getKBIRPdf(req.body,res)
        }
        if(req.body.data[2].type=='MOR'){
            return this._Fileservice.getMORPdf(req.body,res)
        }

        else 
            return res
    }



}


