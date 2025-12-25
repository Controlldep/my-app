import { LikePostDto } from './dto/like-post.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LikePostModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  postId: string;

  @Column({ type: 'varchar', length: 255 })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  addedAt: string;

  @Column({ type: String, enum: ['None', 'Like', 'Dislike'], default: 'None' })
  myStatus: 'None' | 'Like' | 'Dislike';

  static createInstance(dto: LikePostDto): LikePostModel {
    const likePost = new this();
    likePost.userId = dto.userId;
    likePost.postId = dto.postId;
    likePost.login = dto.login;
    likePost.addedAt = new Date().toISOString();
    likePost.myStatus = dto.myStatus;

    return likePost;
  }
}
