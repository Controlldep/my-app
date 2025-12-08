import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePostInputDto } from '../api/dto/input-dto/update-post.input-dto';
import { Post, PostDocument } from '../domain/post.entity';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async save(dto: PostDocument): Promise<string> {
    const post: PostDocument = new this.postModel(dto);
    const savedPost: PostDocument = await post.save();
    console.log(savedPost)
    return savedPost._id.toString();
  }

  async findPostById(id: string): Promise<PostDocument | null> {
    return this.postModel.findById(id);
  }
//TODO интерсно как тут сделать инпут дто в репо такое себе плодить дто чисто дял каждого слоя?)
  async updatePost(id: string, dto: UpdatePostInputDto) {
    const result: PostDocument | null = await this.postModel.findByIdAndUpdate(id, dto);
    if (!result) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
  }

  async deletePost(id: string) {
    const deletePost: PostDocument | null = await this.postModel.findOneAndDelete({ _id: id });
    if (!deletePost) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
  }

  async updateLikesInfo(post: PostDocument) {
    const result: PostDocument | null = await this.postModel.findByIdAndUpdate(
      { _id: post._id },
      { $set: { extendedLikesInfo: post.extendedLikesInfo }})
    if (!result) throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
  }
}
