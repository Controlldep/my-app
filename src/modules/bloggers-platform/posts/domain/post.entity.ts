import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostExtendedLikesInfoDto } from './dto/post.extendedLikesInfo.dto';
import { PostDto } from './dto/post.dto';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ type: PostExtendedLikesInfoDto })
  extendedLikesInfo: PostExtendedLikesInfoDto;

  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: PostDto): PostDocument {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.extendedLikesInfo = { likesCount: 0, dislikesCount: 0 };
    return post as PostDocument;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;
