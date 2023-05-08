import { ProjectService } from './project.service';
import {
    Controller,
    Get,
    Post,
    Request,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadLogo } from 'src/config/multer.config';
@Controller('project')
export class ProjectController {
    constructor(private _Projectservice: ProjectService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/GetStepsByProject')
    getProjects(@Request() req) {
        console.log(req.body)
        return this._Projectservice.GetStepsByProject(req.body.project, req)
    }
    @Post('/GetStepsByProjectForStageProgress')
    getProjectsForStageProgress(@Request() req) {
        console.log(req.body)
        return this._Projectservice.GetStepsByProject2(req.body.project, req)
    }

    // @UseGuards(JwtAuthGuard)
    @Post('/GetStagebyFolder')
    getFolders(@Request() req) {
        //console.log(req.body)
        return this._Projectservice.GetStageByFolder(req.body)
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/GetSteps')
    getSteps() {
        return this._Projectservice.GetSteps()
    }

    @Get('getAllProjects')
    getAllprojects() {

        return this._Projectservice.getallProjects()
    }
    @UseGuards(JwtAuthGuard)
    @Get('getallUserProjects')
    getallUserProjects(@Request() req) {
        return this._Projectservice.getallUserProjects(req)
    }
    @Post('getProjectById')
    getProjectbyId(@Request() req, @Res() res) {
        return this._Projectservice.getProjectbyId(req.body, res)
    }
    @UseGuards(JwtAuthGuard)
    @Post('CreateFolders')
    CreateFolders(@Request() req, @Res() res) {
        console.log("user",req.body)
        return this._Projectservice.createNewFolders(req.body, req.user, res)
    }
    @UseGuards(JwtAuthGuard)
    @Post('editDeleteFolders')
    editdeleteFolders(@Request() req, @Res() res) {
        //console.log(req.body)
        return this._Projectservice.editDeleteFolders(req.body,req.user, res)
    }
    @Post('getFoldersForAsset')
    getFoldersForAsset(@Request() req, @Res() res) {
        console.log(req.body)
        return this._Projectservice.listFoldersForAsset(req.body, res)
    }
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('logo', UploadLogo))
    @Post('CreateProject')
    createProject(@Request() req, @Res() res) {
        console.log(req.body)
        req.body.freeze_asset=false
        //req.body['AssetViewName']=req.body.ProjectName
        return this._Projectservice.createProject(req.body, req.user, res)
    }

    @Post('EditProject')
    @UseInterceptors(FileInterceptor('logo', UploadLogo))
    editProject(@Request() req, @Res() res, @UploadedFile() file) {
        console.log("edit project reqqqqq",req.body,file)
        //Object.hasOwnProperty.bind(queryData)('session')
        if(Object.hasOwnProperty.bind(req.body)("BSMFrom")){
            console.log("yes")
        } else {
            req.body['BSMFrom']=null
            req.body['BSMTo']=null
        }
        if(Object.hasOwnProperty.bind(req.body)("BuildingRegistrationDate")){
            console.log("yes")
        } else {
            req.body['BuildingRegistrationDate']=null
            req.body['FscDate']=null
        }
        return this._Projectservice.editProject(req.body, res)
    }
    @Post('editCreateDA')
    @UseInterceptors(FileInterceptor('logo', UploadLogo))
    editCreateDA(@Request() req, @Res() res) {
        console.log(req.body)
        return this._Projectservice.EditCreateDA(req.body, res)
    }
    @Post('editAtireshStaffs')
    //@UseInterceptors(FileInterceptor('logo', UploadLogo))
    editAtireshStaffs(@Request() req, @Res() res) {
        console.log('aaaa',req.body)
        return this._Projectservice.editAtireshStaffs(req.body, res)
    }
    @Post('DeleteProject')
    DeleteProject(@Request() req, @Res() res) {
        return this._Projectservice.deleteProject(req.body, res)
    }

    @Post('updateStageProgress')
    updateStageProgress(@Request() req, @Res() res) {
        return this._Projectservice.updateStageProgress(req.body, res)
    }

    @Post('getStageByProgress')
    getStageByProgress(@Request() req) {
        return this._Projectservice.getStageProgress(req.body)
    }
    @Post('getProjectbyUserReport')
    getProjectbyUserReport(@Request() req) {
        return this._Projectservice.getProjectbyUserReport(req.body)
    }
    @Post('getProjectUsedSpace')
    getProjectUsedSpace(@Request() req) {
        return this._Projectservice.getProjectUsedSpace(req.body);
    }
    @Post('getClientOverViewReport')
    getClientOverViewReport(@Request() req) {
        return this._Projectservice.getClientOverViewReport(req.body);
    }
    @Post('getAllprojectOverViewReport')
    getAllprojectOverViewReport(@Request() req) {
        return this._Projectservice.getAllprojectOverViewReport(req.body);
    }
    @Post('getFolderLogReport')
    getFolderLogReport(@Request() req) {
        console.log(req.body)
        return this._Projectservice.getFolderLogReport(req.body)
    }
    @Post('getAuditTrailReport')
    getAuditTrailReport(@Request() req) {
        console.log(req.body)
        return this._Projectservice.getAuditTrailReport(req.body);
    }
    @Post('getUserLog')
    getUserLog(@Request() req) {
        console.log(req.body)
        return this._Projectservice.getUserLogReport(req.body);
    }
    @Post('getProjectByClient')
    getProjectByClient(@Request() req) {
        return this._Projectservice.getProjectByClient(req.body);
    }

}
