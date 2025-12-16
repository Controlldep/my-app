import { UsersInputDto } from '../api/input-dto/users.input-dto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  confirmationCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  static createInstance(dto: UsersInputDto): UserModel {
    const user: UserModel = new this();
    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;
    user.isConfirmed = false;
    user.confirmationCode = dto.confirmationCode || null;
    user.expirationDate = dto.expirationDate || null;

    return user;
  }
}
