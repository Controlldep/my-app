import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './testing/testing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './modules/user-accounts/domain/user.entity';
import { settings } from './settings';
//TODO вынесте в env
const uri = 'mongodb+srv://admin:admin@cluster0.0qblhxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: settings.DATABASE_HOST,
    port: settings.PORT_FOR_DATABASE,
    username: settings.MY_USER_NAME,
    password: settings.PASSWORD_DATABASE,
    database: settings.DATABASE_NAME,
    entities: [UserModel],
    synchronize: true,
  }),
    MongooseModule.forRoot(uri), UserModule, BloggersPlatformModule, TestingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
