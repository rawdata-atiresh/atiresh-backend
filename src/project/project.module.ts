import { StepsSchema } from './../schemas/steps';
import { ProjectController } from './project.controller';
import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from 'src/schemas/project';
import { UserSchema } from 'src/schemas/user';
import { AuditTrailSchema } from 'src/schemas/audit_Trail';
import { NotificationSchema } from 'src/schemas/notifications';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'Step', schema: StepsSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Audittrail', schema: AuditTrailSchema },
      { name: 'Notification', schema: NotificationSchema }
    ]),
  ],
  providers: [ProjectService],
  exports: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule { }
