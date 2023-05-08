import { AuthService } from './../auth/auth.service';
import { ProjectSchema } from './../schemas/project';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from './../schemas/user';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsSchema } from 'src/schemas/client';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtireshUserSchema } from 'src/schemas/atiresh-users';
import { OtpSchema } from 'src/schemas/otp';
import { NotificationSchema } from 'src/schemas/notifications';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Project', schema: ProjectSchema },
        { name: 'AtireshUser', schema: AtireshUserSchema },{ name: 'Client', schema: ClientsSchema },{ name: 'Notification', schema:NotificationSchema},
        { name: 'Otp', schema: OtpSchema }]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30m' },
        }),
    ],
    providers: [UsersService, AuthService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule { }
