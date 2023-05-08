import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from 'src/schemas/project';
import { StepsSchema } from 'src/schemas/steps';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ScheduleModule } from '@nestjs/schedule';
import moment from 'moment';
import { AuditTrailSchema } from 'src/schemas/audit_Trail';
import { UserSchema } from 'src/schemas/user';
import { MorSchema } from 'src/schemas/mor_config';
import { NMorSchema } from 'src/schemas/nmor_config';
import { MajorChangeControlSchema } from 'src/schemas/major_change_control';
import { NonMajorChangeControlSchema } from 'src/schemas/non_major_change_control';
import { KbirStage4Schema} from 'src/schemas/kbir_stage4'
import { KbirStage5Schema} from 'src/schemas/kbir_stage5'
import { NotificationSchema } from 'src/schemas/notifications';
@Module({
    imports: [
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([
            { name: 'Step', schema: StepsSchema },
            { name: 'Project', schema: ProjectSchema },
            { name: 'Audittrail', schema: AuditTrailSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Mor' , schema: MorSchema},
            { name: 'NMor' , schema: NMorSchema},
            { name: 'MajorChangeControl' , schema:MajorChangeControlSchema},
            { name: 'NonMajorChangeControl' , schema:NonMajorChangeControlSchema},
            { name: 'KbirStage4' , schema:KbirStage4Schema},
            { name: 'KbirStage5' , schema:KbirStage5Schema},
            { name: 'Notification', schema:NotificationSchema}
        ]),
    ],
    controllers: [FilesController],
    providers: [FilesService]
})
export class FilesModule { }
