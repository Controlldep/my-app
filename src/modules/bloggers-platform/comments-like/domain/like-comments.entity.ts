import { likeCommentsDto } from './dto/like-comments.dto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

@Entity()
export class LikeCommentsModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  commentId: string;

  @Column({ type: 'enum', enum: LikeStatus, default: LikeStatus.None })
  myStatus: 'None' | 'Like' | 'Dislike';

  @CreateDateColumn()
  createdAt: Date;

  static createInstance(dto: likeCommentsDto): LikeCommentsModel {
    const likeComments: LikeCommentsModel = new this();
    likeComments.userId = dto.userId;
    likeComments.commentId = dto.commentId;
    likeComments.myStatus = dto.myStatus;

    return likeComments;
  }
}