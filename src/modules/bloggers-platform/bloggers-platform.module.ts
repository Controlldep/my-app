import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogControllers } from './blogs/api/blog.controllers';
import { BlogRepository } from './blogs/infrastructure/blog.repository';
import { BlogService } from './blogs/application/blog.service';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsQueryRepository } from './blogs/infrastructure/blog.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [BlogRepository, BlogService, BlogsQueryRepository],
  controllers: [BlogControllers],
})
export class BloggersPlatformModule {}
