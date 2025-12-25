import { PostExtendedLikesInfoDto } from './dto/post.extendedLikesInfo.dto';
import { PostDto } from './dto/post.dto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar' })
  shortDescription: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  blogId: string;

  @Column({ type: 'varchar', length: 255 })
  blogName: string;

  @Column({ type: 'jsonb', default: () => `'{"likesCount":0,"dislikesCount":0}'` })
  extendedLikesInfo: PostExtendedLikesInfoDto;

  @CreateDateColumn()
  createdAt: Date;

  static createInstance(dto: PostDto): PostModel {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.extendedLikesInfo = { likesCount: 0, dislikesCount: 0 };
    return post;
  }
}
