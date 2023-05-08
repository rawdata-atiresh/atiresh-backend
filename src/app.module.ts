import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //MongooseModule.forRoot('mongodb://localhost:27017/Atiresh_prod', {
    //MongooseModule.forRoot('mongodb://localhost:27017/Atiresh_workflow', {
    MongooseModule.forRoot(`mongodb+srv://admin:S1r9F2W68m4TL53h@db-mongodb-blr1-84714-236fc21c.mongo.ondigitalocean.com/Atiresh_prod?authSource=admin&replicaSet=db-mongodb-blr1-84714&tls=true&tlsCAFile=ca-certificate.cer
      `, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }),
    AuthModule,
    UsersModule,
    ProjectModule,
    FilesModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../', 'public'),
    //   serveStaticOptions: {
    //     index: false,
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

