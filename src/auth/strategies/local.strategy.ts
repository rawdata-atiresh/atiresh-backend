import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' , passReqToCallback: true });
    }

    async validate(req: Request,email: string, password: string , headers:Headers): Promise<any> {
        //console.log(req.body)
        const app=req.body
        const user = await this.authService.validateUser(email, password,app);
        if (!user) {
            return true
        }
        return user;
    }
}
