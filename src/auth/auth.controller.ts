import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    Res,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/signup')
    async signUp(@Request() req, @Res() res) {
        return await this.authService.signUp(req, res);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async signIn(@Request() req, @Res() res) {
        //console.log(req)
        return this.authService.signIn(req.body,req.user, res);
    }
    @UseGuards(LocalAuthGuard)
    @Post('/signinOtp')
    async signInOtp(@Request() req, @Res() res) {
        //console.log(req.user)
        return this.authService.signInOtp(req, res);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/ResetPassword')
    async ResetPassword(@Request() req, @Res() res) {
        return this.authService.ResetPassword(req, res);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/isAuthenticated')
    getMe(@Request() req) {
        // console.log(req)
        return req.user;
    }
}

