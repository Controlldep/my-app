import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import { BlogInputUpdateDto } from '../api/dto/blog.input-update-dto';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findBlogById(id: string) {
    return await this.blogModel.findById(id);
  }

  async save(dto: BlogDocument): Promise<BlogDocument> {
    const blog: BlogDocument = new this.blogModel(dto);
    return blog.save();
  }

  async updateBlog(id: string, dto: BlogInputUpdateDto) {
    const result = await this.blogModel.findByIdAndUpdate(id, dto);
    if (!result)
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
  }

  async deleteBlog(id: string) {
    const deleteUser = await this.blogModel.findOneAndDelete({ _id: id });
    if (!deleteUser)
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
  }
}
