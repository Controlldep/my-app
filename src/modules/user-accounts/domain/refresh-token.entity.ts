import { DomainRefreshTokenDto } from '../dto/domain-refresh-token.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshTokenModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  jtiHash: string;

  @Column({ type: 'varchar' })
  deviceId: string;

  @Column({ type: 'varchar', nullable: true })
  expiresAt: string | null;

  static createInstance(dto: DomainRefreshTokenDto): RefreshTokenModel {
    const refreshToken: RefreshTokenModel = new this();
    refreshToken.userId = dto.userId;
    refreshToken.jtiHash = dto.jtiHash;
    refreshToken.deviceId = dto.deviceId;
    refreshToken.expiresAt = dto.expiresAt;

    return refreshToken;
  }
}
