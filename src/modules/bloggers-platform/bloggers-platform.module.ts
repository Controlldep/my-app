import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogControllers } from './blogs/api/blog.controllers';
import { BlogRepository } from './blogs/infrastructure/blog.repository';
import { BlogService } from './blogs/application/blog.service';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsQueryRepository } from './blogs/infrastructure/blog.query-repository';
import { PostControllers } from './posts/api/post.controllers';
import { PostService } from './posts/application/post.service';
import { PostRepository } from './posts/infrastructure/post.repository';
import { PostQueryRepository } from './posts/infrastructure/post.query-repository';
import { Post, PostSchema } from './posts/domain/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  providers: [BlogRepository, BlogService, BlogsQueryRepository, PostService, PostRepository, PostQueryRepository],
  controllers: [BlogControllers, PostControllers],
})
export class BloggersPlatformModule {}
