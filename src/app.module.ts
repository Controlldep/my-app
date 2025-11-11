import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user-accounts/user-accounts.module';
//TODO вынесте в env
const uri =
  'mongodb+srv://admin:admin@cluster0.0qblhxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [MongooseModule.forRoot(uri), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
