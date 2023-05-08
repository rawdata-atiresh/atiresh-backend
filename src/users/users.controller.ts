import { UsersService } from './users.service';
import {
    Body,
    Controller,
    Get,
    Post,
    // Post,
    Request,
    Res,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NewUserDto, UpdateUserDto } from './dto/user.dto'
import { NewAtireshUserDto, UpdateAtireshUserDto } from './dto/atirshUser.dto';
import { NewClientDto } from './dto/client.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadLogo, UploadUserImage } from 'src/config/multer.config';
@Controller('users')
export class UsersController {
    constructor(private _Userservice: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserDetails')
    getUser(@Request() req) {
        return this._Userservice.getUserProfile(req.user._id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/GetUserProjects')
    getProjects(@Request() req) {
        return this._Userservice.getUserProjects(req.user._id)
    }
    @UseGuards(JwtAuthGuard)
    @Post('/getFileUploadNotifications')
    getFileUploadNotifications(@Request() req, @Res() res) {
        console.log("notification",req.body)
        return this._Userservice.getFileUploadNotif(req.body,res)
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('/getFileUploadNotificationsCount')
    getFileUploadNotificationsCount(@Request() req, @Res() res) {
        //console.log("notification",req.body)
        return this._Userservice.getFileUploadNotifCount(req.body,res)
    }
    @UseGuards(JwtAuthGuard)
    @Post('/AddNewUser')
    @UseInterceptors(FileInterceptor('picture', UploadUserImage))
    addNewUser(@Request() req, @Res() res,
        @Body(ValidationPipe) NewUserDto: NewUserDto) {
        console.log(req.body);
        req.body.type='User'
        req.body.freeze_user=false
        if(req.body.isAdmin==true){
            req.body.type='SuperAdmin'
            console.log("yes")
        }
        return this._Userservice.createNewUser(NewUserDto, res, req)
    }
    @UseGuards(JwtAuthGuard)
    @Post('/AddNewAtireshUser')
    //@UseInterceptors(FileInterceptor('picture', UploadUserImage))
    addNewAtireshUser(@Request() req, @Res() res,
        @Body(ValidationPipe) NewAtireshUserDto: NewAtireshUserDto){
        console.log(req.body , req.user._id);
        req.body.type='AtireshStaff'
        req.body.company="Atiresh"
        req.body.freeze_user=false
        req.body.role="Atiresh Staff"
        return this._Userservice.createNewAtireshUser(NewAtireshUserDto, res, req)
    }
    @Get('/GetUserList')
    getUserList() {
        const user_type = 'User'
        const user_type2=''
        return this._Userservice.loadUsersList(user_type,user_type2)
    }
    @Get('/GetAtireshUserList')
    getAtireshUserList() {
        const user_type = 'AtireshStaff'
        const user_type2='SuperAdmin'
        return this._Userservice.loadUsersList(user_type,user_type2)
    }
    @Post('getAtireshStaffbyId')
    //@UseInterceptors(FileInterceptor('logo', UploadLogo))
    getAtireshStaffbyId(@Request() req, @Res() res) {
        console.log('aaaa',req.body)
        return this._Userservice.getAtireshStaffbyId(req.body, res)
    }
    @UseGuards(JwtAuthGuard)
    @Get('/GetUserListByClient')
    GetUserListByClient(@Request() req) {
        return this._Userservice.GetUserListByClient(req)
    }
    @UseGuards(JwtAuthGuard)
    @Post('/GetUserListByClient')
    PostUserListByClient(@Request() req) {
        return this._Userservice.GetUserListByClient(req)
    }

    @Post('/EditUser')
    @UseInterceptors(FileInterceptor('picture', UploadUserImage))
    @UsePipes(new ValidationPipe())
    editUser(@Request() req, @Body(ValidationPipe) userDto: UpdateUserDto, @Res() res) {
        if(req.body.isAdmin==true){
            req.body.type='SuperAdmin'
            console.log("yes")
        } else {
            req.body.type='User'
        }
        return this._Userservice.editUser(userDto, res)
    }
    @Post('/EditAtireshUser')
    @UseInterceptors(FileInterceptor('picture', UploadUserImage))
    @UsePipes(new ValidationPipe())
    editAtireshUser(@Request() req, @Body(ValidationPipe) userDto: UpdateUserDto, @Res() res) {
        if(req.body.isAdmin==true){
            req.body.type='SuperAdmin'
            console.log("yes")
        } else {
            req.body.type='AtireshStaff'
        }
        return this._Userservice.editUser(userDto, res)
    }

    @Post('/DeleteUser')
    deleteUser(@Request() req, @Res() res) {
        console.log('DeleteUser')
        return this._Userservice.deleteUser(req.body.userId, res)
    }

    @Post('/GetClients')
    getClients(@Request() req) {
        return this._Userservice.loadClients();
    }

    @Get('/ClientList')
    ClientList() {
        return this._Userservice.loadClientList()
    }

    @UseGuards(JwtAuthGuard)
    @Post('/AddNewClient')
    @UseInterceptors(FileInterceptor('logo', UploadLogo))
    CreateClient(@Request() req, @Body(ValidationPipe) ClientDto: NewClientDto, @Res() res) {
        console.log(req.user._id)
        return this._Userservice.CreateClient(req.user, ClientDto, res)
    }

    @Post('/editClient')
    @UseInterceptors(FileInterceptor('logo', UploadLogo))
    editClient(@Request() req, @Res() res) {
        console.log(req.body)
        return this._Userservice.UpdateClient(req.body, res)
    }

    @Post('/deleteClient')
    deleteClient(@Request() req, @Res() res) {
        return this._Userservice.DeleteClient(req.body.clientId, res)
    }
    @Post('/loadUsersList')
    loadUsersList(@Request() req) {
        const user_type='User'
        return this._Userservice.loadUsersList(user_type,'')
    }
    @Post('/loadUserById')
    loadUserById(@Request() req) {
        return this._Userservice.loadUserById(req.body._id)
    }

    @Post('/loadClientById')
    loadClientById(@Request() req) {
        return this._Userservice.loadClientById(req.body._id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/loadProfile')
    loadProfile(@Request() req) {
        return this._Userservice.loadProfile(req.user._id)
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('picture', UploadUserImage))
    @Post('UpdateProfile')
    UpdateUserProfile(@Request() req, @Res() res) {
        console.log(req.body)
        return this._Userservice.UpdateUserProfile(req.user._id, req.body, res)
    }

    @Post('/GetAllUsers')
    getUserByClient(@Request() req) {
        return this._Userservice.GetUsers();
    }
    // @Post('/updatePassword')
    // updatePassword(@Request() req, @Res() res) {
    //     console.log(req.body)
    //     return this._Userservice.changePassword(req,res);
    // }
    @UseGuards(JwtAuthGuard)
    @Post('/updatePassword')
    updatePassword(@Request() req, @Res() res) {
        console.log(req.body)
        return this._Userservice.changePassword(req.body, res)
    }
    @Post('/ResetUserPassword')
    ResetUserPassword(@Request() req, @Res() res) {
        // console.log(req)
        return this._Userservice.ResetUserPassword(req, res);
    }
  
}
