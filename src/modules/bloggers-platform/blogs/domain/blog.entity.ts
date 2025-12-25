import { BlogInputDto } from '../api/dto/input-dto/blog.input-dto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlogModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  websiteUrl: string;

  @Column({ type: 'boolean', default: false })
  isMembership: boolean;

  @CreateDateColumn()
  createdAt: Date;

  static createInstance(dto: BlogInputDto): BlogModel {
    const blog: BlogModel = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = false;

    return blog;
  }
}
