import { Module } from '@nestjs/common';
import { BlogControllers } from './blogs/api/blog.controllers';
import { BlogRepository } from './blogs/infrastructure/blog.repository';
import { BlogService } from './blogs/application/blog.service';
import { BlogModel } from './blogs/domain/blog.entity';
import { BlogsQueryRepository } from './blogs/infrastructure/blog.query-repository';
import { PostControllers } from './posts/api/post.controllers';
import { PostService } from './posts/application/post.service';
import { PostRepository } from './posts/infrastructure/post.repository';
import { PostQueryRepository } from './posts/infrastructure/post.query-repository';
import { PostModel } from './posts/domain/post.entity';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query.repository';
import { CommentsService } from './comments/application/comments.service';
import { LikeCommentsRepository } from './comments-like/infrastructrure/like-comments.repository';
import { LikeCommentsService } from './comments-like/application/like-comments.service';
import { CommentsModel } from './comments/domain/comments.entity';
import { LikeCommentsModel } from './comments-like/domain/like-comments.entity';
import { UserModule } from '../user-accounts/user-accounts.module';
import { JwtService } from '../user-accounts/application/jwt.service';
import { LikePostModel } from './post-likes/domain/like-post.entity';
import { LikePostService } from './post-likes/application/like-post.service';
import { LikePostRepositories } from './post-likes/infrastructure/like-post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../user-accounts/domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, BlogModel, PostModel, CommentsModel, LikeCommentsModel, LikePostModel]),
    UserModule,
  ],
  providers: [BlogRepository, BlogService, BlogsQueryRepository, PostService, PostRepository, PostQueryRepository, CommentsRepository, CommentsQueryRepository, CommentsService,
  LikeCommentsRepository, LikeCommentsService, JwtService, LikePostService, LikePostRepositories],
  controllers: [BlogControllers, PostControllers, CommentsController],
})
export class BloggersPlatformModule {}
