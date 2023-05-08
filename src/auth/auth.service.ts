import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { createTransport } from 'nodemailer'
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as speakeasy from "speakeasy";
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../schemas/user';
import { Otp} from '../schemas/otp'
import { join } from 'path';

@Injectable()
export class AuthService {
    transporter: any = createTransport({
        host: 'smtp.office365.com',
        port: '587',
        auth: { user: 'digitalasset_support@atiresh.co.uk', pass: 'Lov86782' },
        secureConnection: false,
        tls: { ciphers: 'SSLv3' }
    })
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Otp') private OtpModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async signUp(req, res): Promise<any> {
        try {
            console.log(req.user)
            const { username, _id } = req.user;
            const password = req.body.password

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userModel.findByIdAndUpdate(_id, { password: hashedPassword }, { useFindAndModify: true })
            console.log(user);
            res.json({ code: 200, result: 'Passwored Updated Successfully..!' })

        } catch (error) {
            // if (error.code === 11000) {
            //     throw new ConflictException('User already exists');
            // }
            res.json({ code: 400, result: 'Error Occured..!' })
        }
    }

    async ResetPassword(req, res): Promise<any> {
        try {
            console.log(req.user, req.body.password)
            const { username, _id } = req.user;
            const password = req.body.password

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userModel.findByIdAndUpdate(_id, { password: hashedPassword }, { useFindAndModify: true })
            console.log(user);
            res.json({ code: 200, result: "Password has reseted successfully..!" })
        } catch (error) {
            console.log(error);
            res.json({ code: 400, result: error })
        }
    }

    async signInOtp(req,res){
        let user=req.user
        let body=req.body
        let k: any = await this.OtpModel
                    .find({email:body.email,app:body.app})
                    .sort({ 'updated_at': -1 })
                    .limit(1);
        console.log(body.otp,k[0].token,body.app)
        let currentTime: number = Date.now();
        let diff = (currentTime - k[0].expiry) / 1000;
        const payload = { username: user.username, sub: user._id, expiresIn:"24h" };
        if (diff>0){
            res.json({ "code": 401, "message": "The otp entered has expired" });
        } else {
        if (body.otp==k[0].token) {
            console.log("validated in ", body.app)
            res.status(201).json({
                "code": 201,
                accessToken: this.jwtService.sign(payload),
                "user": user
            });
        } else {
            console.log("not validated",body.app)
            res.json({ "code": 406, "message": "You have entered the wrong Otp..!" });
        }
        }
    }
    
    async signIn(body,user, res) {
        try {
            console.log('Invalid', user)
            if (user !== true) {




                const secret = speakeasy.generateSecret({ length: 20 });
                var token = speakeasy.totp({
                    secret: secret.base32,
                    //encoding: "base32",
                  });
                // console.log("secret",secret,token)
                // console.log(user)
                const payload = { username: user.username, sub: user._id };
                let otp: any = await this.OtpModel.findOne({email:user.email,app:body.app});    
                console.log("usertoattempt",otp)
                let currentTime: number = Date.now();
                if (otp) {
                  let k: any = await this.OtpModel
                    .find({ email: user.email,app:body.app})
                    .sort({ 'updated_at': -1 })
                    .limit(1);
                  if (k !== undefined) {
                    let diff = (currentTime - k[0].expiry) / 1000;
              
                    let updateTime: number = Date.now();
                    let createDto: any = {
                      token: token,
                      email: user.email,
                      secret: secret,
                      app:body.app,
                    //   firstName: firstName,
                    //   lastName: lastName,
                      expiry: updateTime + 1 * 300 * 1000,
                    };
                   // if (diff > 0) {
                      let _otp: any = await this.OtpModel.create(createDto);
                      let _data =
                        "Otp sent to registered email " +
                        user.email +
                        "in " + body.app + " app" +
                        " " +
                        "token:" +
                        token;
                    //   await this.emailService.sendEmail(
                    //     new OtpEmail(
                    //       new EmailDto({
                    //         to: body.email,
                    //         metaData: { email, token, firstName, lastName },
                    //       })
                    //     )
                    //   );
                     // return success(_data);
                     this.sendOtpMail(createDto)
                     res.status(201).json({"code":201,"message":"Otp Sent to registered email","user": user,"diff":"-300"})
                     console.log(_data)
                    // } else {
                    //     //const result2 = new Date(seconds * 1000).toISOString().slice(14, 19);
                    //   let errorData = "OTP already sent yet to expire in " + new Date(Math.round(Math.abs(diff)) * 1000).toISOString().slice(14, 19) + " minutes. Please use the same OTP";
                    //   let errorData2 = "OTP already sent yet to expire in " + Math.round(Math.abs(diff)) + " seconds in " + body.app + " app"
                    //   let diff2=Math.round(diff)
                    //   res.status(201).json({"code":201,"message":errorData,"user": user,"diff":diff2})
                    // //   throw new BadRequestException(OTP_NOT_EXPIRED(errorData));
                    // console.log(errorData2)
                    // }
                  }
                } else {
                    let updateTime: number = Date.now();
                    let createDto: any = {
                    token: token,
                    email: user.email,
                    secret: secret,
                    app:body.app,
                    expiry: updateTime + 1 * 300 * 1000,
                    };
                    let _otp1: any = await this.OtpModel.create(createDto);
                    // await this.emailService.sendEmail(
                    //   new OtpEmail(
                    //     new EmailDto({
                    //       to: body.email,
                    //       metaData: { email, token, firstName, lastName },
                    //     })
                    //   )
                    // );
                    let _data1 =
                    "Otp sent to registered email " + user.email + "in " + body.app + " app"+" " + "token:" + token;
                    console.log(_data1);
                    //console.log(user.username,user._id)
                    this.sendOtpMail(createDto)
                    res.status(201).json({"code":201,"message":"Otp Sent to registered email","user": user,"diff":"-300"})
                }              




                // res.status(201).json({
                //     "code": 201,
                //     accessToken: this.jwtService.sign(payload),
                //     "user": user
                // });
            } else {
                console.log('Invalid')
                res.json({ "code": 401, "message": "Wrong Email or Password..!" });
            }
        } catch (err) {
            console.log(err);

        }

    }

    async validateUser(username: string, pass: string , req): Promise<User> {
        const app=req.app
        if(app=='admin'){
            const user = await this.userModel.findOne({ username });
            if(!user){
                return null
            }
            const valid = await bcrypt.compare(pass, user.password);
            if (valid && (user.type=='AtireshStaff' || user.type=="SuperAdmin")){
                return user
            }
            return null
        } else {
            const user = await this.userModel.findOne({ username });
            if (!user) {
                return null;
            }
            const valid = await bcrypt.compare(pass, user.password);
            if (valid) {
                return user;
            }
            return null;
        }
    }
    async GenerateToken(payload) {
        console.log(payload)
        // const payload = { username: user.username, sub: user._id };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    async sendOtpMail(details){
        //console.log("email Sent",details)
        try {
            console.log("sendEmail staff............")
            let info = await this.transporter.sendMail({
                from: '"Atiresh Admin" <digitalasset_support@atiresh.co.uk>', // sender address
                to: details.email, // list of receivers
                subject: "One Time Password (OTP) Confirmation - Atiresh", // Subject line
                html: 
                //`<p>Dear ${user.first_name},</p>   
                `<p>
                Dear User, Your OTP for login is <b>${details.token}</b>. Use this password to validate your login.
                This OTP will expire in 5 minutes.
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









    
// import {
//     Controller,
//     Post,
//     Req,
//     UseGuards,
//     Get,
//     Body,
//     BadRequestException,
//     Param,
//     NotFoundException,
//   } from "@nestjs/common";
//   import { JwtAuthGuard } from "./auth.guard";
//   import { LoggedInToken } from "../users/objects/login-user.dto";
//   import { AuthService } from "./auth.service";
//   import * as speakeasy from "speakeasy";
//   import { optSecret } from "../common/constants/config";
//   import {
//     UNKNOWN_PARAM,
//     EMAIL_NOT_FOUND,
//     OTP_ERROR,
//     EXISTS,
//     OTP_NOT_EXPIRED,
//     NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD_ERROR,
//     OTP_TIME_OUT,
//     TOKEN_ALREADY_USED,
//     EMAIL_ERROR,
//     BLOCKED_ACCOUNT_ERROR,
//   } from "../common/constants/string";
//   import { plainToClass } from "class-transformer";
//   import { success } from "../common/base/httpResponse.interface";
//   import { UserDto } from "../users/objects/create-user.dto";
//   import { OtpEmail, UserCycloanAccountBlockedEmail } from "../users/objects/user.registered.email";
//   import {
//     ForgetPasswordOtpEmail,
//     PasswordChangedAlert,
//   } from "../users/objects/user.registered.email";
//   import { EmailService } from "../email/email.service";
//   import { OtpService } from "./otp/otp.service";
//   import { RequestUser } from "../common/utils/controller.decorator";
//   import { UsersService } from "../users/users.service";
//   import { EmailDto } from "../email/objects/email.dto";
//   import { OtpDto } from "./otp/otp.dto";
//   import { InjectModel } from "@nestjs/mongoose";
//   import { IOtp, Otp } from "./otp/otp.schema";
//   import { Model } from "mongoose";
//   import { ForgotPasswordOtpService } from "./forgot-password-otp/forgot-password-otp.service";
//   import { ForgotPasswordOtp } from "./forgot-password-otp/forgot-password-otp.schema";
//   import { ForgotPasswordOtpDto } from "./forgot-password-otp/forgot-password-otp.dto";
//   import { OtpIncorrectService } from "./otpIncorrect/otpIncorrect.service";
//   import { OtpIncorrect } from "./otpIncorrect/otpIncorrect.schema";
//   import { BlockedAccountService } from "./blockedAccounts/blockedAccounts.service";
//   import { IBlockedAccount } from "./blockedAccounts/blockedAccounts.schema";
//   import { OTP_RETRY_LIMIT, Status, ROLES_ACCESS_ACTION, BLOCKED_ACCOUNT_TYPE } from "../common/constants/enum";
//   import { RolesService } from "../roles/roles.service";
//   import { OtpIncorrectForgotPasswordService } from "./otpIncorrectForgotPassword/otpIncorrectForgotPassword.service";
//   import { OtpIncorrectForgotPassword } from "./otpIncorrectForgotPassword/otpIncorrectForgotPassword.schema";
  
//   //@UseGuards(JwtAuthGuard)
//   @Controller("auth/refresh")
//   export class AuthController {
//     constructor(
//       private authService: AuthService,
//       private emailService: EmailService,
//       private usersService: UsersService,
//       private otpService: OtpService,
//       private forgotPasswordOtpService: ForgotPasswordOtpService,
//       @InjectModel("Otp") private readonly otpModel: Model,
//       @InjectModel("ForgotPasswordOtp")
//       private readonly forgotPasswordotpModel: Model,
//       private readonly otpIncorrectService: OtpIncorrectService,
//       @InjectModel("OtpIncorrect") private readonly otpIncorrectModel: Model,
//       private readonly blockedAccountService: BlockedAccountService,
//       @InjectModel("BlockedAccount") private readonly blockedAccountModel: Model,
//       private rolesservice: RolesService,
//       private otpIncorrectForgotPasswordService: OtpIncorrectForgotPasswordService,
//       @InjectModel("OtpIncorrectForgotPassword") private readonly otpIncorrectForgotPasswordModel: Model,
//     ) {}
  
//   @UseGuards(JwtAuthGuard)
//     @Post()
//     public async refresh(@Req() req): Promise {
//       return this.authService.createJwtPayLoad(req.user);
//     }
  
//   //Api For generating a secret and storing it in config.ts
//     @Get("secret")
//     async getSecret() {
//       const secret = speakeasy.generateSecret({ length: 20 });
//       return secret;
//     }
//     //Api For generating a 6 digit token using the secret
  
//   @Post("generate")
//     async getOtp(
//       @Req() req,
//       @Body() body: { email: string; firstName: string; lastName: string }
//       //@RequestUser() user
//     ) {
//       debugger;
//       let email = body.email;
//       let firstName = body.firstName;
//       let lastName = body.lastName;
//       var token = speakeasy.totp({
//         secret: optSecret,
//         encoding: "base32",
//       });
//   let userToAttempt: any = await this.usersService.findOneByEmail(body.email);
  
//   //Check for existing users
//   if (!userToAttempt) {
  
//    let _blocked: any = await this.blockedAccountService.findOneByQuery({email: email, type: BLOCKED_ACCOUNT_TYPE.USER_REGISTRATION})
  
//    if(_blocked !== null){
//       throw new BadRequestException(BLOCKED_ACCOUNT_ERROR(email))
//     }
  
//     let query = { email: email };
  
//     let _otp: any = await this.otpService.findOneByQuery(query);
//     let currentTime: number = Date.now();
//     if (_otp) {
//       let k: any = await this.otpModel
//         .find({ email: email })
//         .sort({ updatedTime: -1 })
//         .limit(1);
//       if (k !== undefined) {
//         let diff = (currentTime - k[0].expiry) / 1000;
  
//         let updateTime: number = Date.now();
//         let createDto: any = {
//           token: token,
//           email: email,
//           firstName: firstName,
//           lastName: lastName,
//           expiry: updateTime + 15 * 60 * 1000,
//         };
//         if (diff > 0) {
//           let _otp: any = await this.otpService.create(createDto);
//           let _data =
//             "Otp sent to registered email " +
//             body.email +
//             " " +
//             "token:" +
//             token;
//           await this.emailService.sendEmail(
//             new OtpEmail(
//               new EmailDto({
//                 to: body.email,
//                 metaData: { email, token, firstName, lastName },
//               })
//             )
//           );
//           return success(_data);
//         } else {
//           let errorData = "Otp sent yet to expire in" + diff + "seconds";
//           throw new BadRequestException(OTP_NOT_EXPIRED(errorData));
//         }
//       }
//     }
//     //For users requesting for the first time
//     let updateTime: number = Date.now();
//     let createDto: any = {
//       token: token,
//       email: email,
//       expiry: updateTime + 15 * 60 * 1000,
//     };
//     let _otp1: any = await this.otpService.create(createDto);
//     await this.emailService.sendEmail(
//       new OtpEmail(
//         new EmailDto({
//           to: body.email,
//           metaData: { email, token, firstName, lastName },
//         })
//       )
//     );
//     let _data1 =
//       "Otp sent to registered email " + body.email + " " + "token:" + token;
//     return success(_data1);
//   }
//   throw new BadRequestException(EXISTS, "User exists");
  
//   }
//   }
  
    