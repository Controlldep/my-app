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
import { CommentsController } from './comments/api/comments.controller';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query.repository';
import { CommentsService } from './comments/application/comments.service';
import { LikeCommentsRepository } from './comments-like/infrastructrure/like-comments.repository';
import { LikeCommentsService } from './comments-like/application/like-comments.service';
import { Comments, CommentsSchema } from './comments/domain/comments.entity';
import { LikeComments, LikeCommentsSchema } from './comments-like/domain/like-comments.entity';
import { UserModule } from '../user-accounts/user-accounts.module';
import { JwtService } from '../user-accounts/application/jwt.service';
import { LikePost, LikePostSchema } from './post-likes/domain/like-post.entity';
import { LikePostService } from './post-likes/application/like-post.service';
import { LikePostRepositories } from './post-likes/infrastructure/like-post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comments.name, schema: CommentsSchema },
      { name: LikeComments.name, schema: LikeCommentsSchema },
      { name: LikePost.name, schema: LikePostSchema },
    ]),
    UserModule,
  ],
  providers: [BlogRepository, BlogService, BlogsQueryRepository, PostService, PostRepository, PostQueryRepository, CommentsRepository, CommentsQueryRepository, CommentsService,
  LikeCommentsRepository, LikeCommentsService, JwtService, LikePostService, LikePostRepositories],
  controllers: [BlogControllers, PostControllers, CommentsController],
})
export class BloggersPlatformModule {}
