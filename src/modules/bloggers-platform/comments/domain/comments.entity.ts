import { commentsDto } from './dto/comments.dto';
import { CommentsLikesInfoDto } from './dto/comments-likes-info.dto';
import { CommentsCommentatorInfoDto } from './dto/comments-commentator-info.dto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CommentsModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  postId: string;

  @Column({ type: 'jsonb' })
  commentatorInfo: CommentsCommentatorInfoDto;

  @Column({ type: 'jsonb', default: () => `'{"likesCount":0,"dislikesCount":0}'` })
  likesInfo: CommentsLikesInfoDto;

  @CreateDateColumn()
  createdAt: Date;

  static createInstance(dto: commentsDto): CommentsModel {
    const comments: CommentsModel = new this();
    comments.content = dto.content;
    comments.postId = dto.postId;
    comments.commentatorInfo = {
      userId: dto.commentatorInfo.userId,
      userLogin: dto.commentatorInfo.userLogin,
    };
    comments.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
    }

    return comments;
  }
}