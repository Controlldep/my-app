import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePostInputDto } from '../api/dto/input-dto/update-post.input-dto';
import { Post, PostDocument } from '../domain/post.entity';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async save(dto: PostDocument): Promise<string> {
    const post: PostDocument = new this.postModel(dto);
    const savedPost: PostDocument = await post.save();
    return savedPost._id.toString();
  }

  async findPostById(id: string): Promise<PostDocument | null> {
    return this.postModel.findById(id);
  }

  async updatePost(id: string, dto: UpdatePostInputDto) {
    const result = await this.postModel.findByIdAndUpdate(id, dto);
    if (!result)
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: string) {
    const deletePost = await this.postModel.findOneAndDelete({ _id: id });
    if (!deletePost)
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}
