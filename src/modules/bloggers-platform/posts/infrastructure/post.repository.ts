import { Injectable } from '@nestjs/common';
import { UpdatePostInputDto } from '../api/dto/input-dto/update-post.input-dto';
import { PostModel } from '../domain/post.entity';
import { CustomHttpException, DomainExceptionCode } from '../../../../core/exceptions/domain.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  async save(dto: PostModel): Promise<string> {
    const post: PostModel = this.postRepository.create(dto);
    const savedPost = await this.postRepository.save(post);
    return savedPost.id.toString();
  }

  async findPostById(id: string): Promise<PostModel | null> {
    return await this.postRepository.findOne({ where: { id } });
  }
//TODO интерсно как тут сделать инпут дто в репо такое себе плодить дто чисто дял каждого слоя?)
  async updatePost(id: string, dto: UpdatePostInputDto): Promise<void> {
    const result = await this.postRepository.update({ id }, dto);
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }

  async deletePost(id: string): Promise<void> {
    const result = await this.postRepository.delete({ id });
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }

  async updateLikesInfo(post: PostModel): Promise<void> {
    const result = await this.postRepository.update(
      { id: post.id },
      { extendedLikesInfo: post.extendedLikesInfo }
    );
    if (result.affected === 0) {
      throw new CustomHttpException(DomainExceptionCode.NOT_FOUND);
    }
  }
}
