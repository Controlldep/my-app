import { Module } from '@nestjs/common';
import { UserModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './testing/testing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './modules/user-accounts/domain/user.entity';
import { settings } from './settings';
import { BlogModel } from './modules/bloggers-platform/blogs/domain/blog.entity';
import { PostModel } from './modules/bloggers-platform/posts/domain/post.entity';
import { SessionModel } from './modules/user-accounts/domain/session.entity';
import { RefreshTokenModel } from './modules/user-accounts/domain/refresh-token.entity';
//TODO вынесте в env
//const uri = 'mongodb+srv://admin:admin@cluster0.0qblhxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: settings.DATABASE_HOST,
    port: settings.PORT_FOR_DATABASE,
    username: settings.MY_USER_NAME,
    password: settings.PASSWORD_DATABASE,
    database: settings.DATABASE_NAME,
    entities: [UserModel, BlogModel, PostModel, SessionModel, RefreshTokenModel],
    synchronize: true,
  }),
    UserModule,
    BloggersPlatformModule,
    TestingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
