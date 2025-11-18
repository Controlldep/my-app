import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../domain/blog.entity';
import { BlogInputUpdateDto } from '../api/dto/input-dto/blog.input-update-dto';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findBlogById(id: string): Promise<BlogDocument | null> {
    return await this.blogModel.findById(id);
  }

  async save(dto: BlogDocument): Promise<string> {
    const blog: BlogDocument = new this.blogModel(dto);
    const saveBlog: BlogDocument = await blog.save();
    return saveBlog._id.toString();
  }

  async updateBlog(id: string, dto: BlogInputUpdateDto) {
    const result = await this.blogModel.findByIdAndUpdate(id, dto);
    if (!result)
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
  }

  async deleteBlog(id: string) {
    const deleteBlog = await this.blogModel.findOneAndDelete({ _id: id });
    if (!deleteBlog)
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
  }
}
