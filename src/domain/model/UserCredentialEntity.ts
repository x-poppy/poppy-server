import { Entity, PrimaryColumn, Column, Index } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

@Entity('pp_user_credential')
export class UserCredentialEntity extends PPEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  userId!: string;

  @Column({
    type: 'bigint',
  })
  @Index()
  appId!: string;

  @Column({
    type: 'bool',
    comment: 'twoFactorAuth',
    default: false,
  })
  twoFactorAuth = false;

  @Column({
    length: 32,
    comment: 'chars randomStr for security reason',
  })
  nonce!: string;

  @Column({
    length: 128,
    comment: 'user passwd sha2(raw pwd + use_no + random_no) hex',
  })
  passwd!: string;

  @Column({
    type: 'varchar',
    length: '50',
    nullable: true,
    comment: 'user opt key aes + random_no + row pwd dev for spec',
  })
  otpKey: string | null = null;
}
