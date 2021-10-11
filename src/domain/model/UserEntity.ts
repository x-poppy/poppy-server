import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from '@augejs/typeorm';

export enum UserStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
  LOCKED = 'locked',
}

@Entity('pp_user')
@Index('idx_app_account', ['appNo', 'accountName'], { unique: true })
export class UserEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  userNo!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo for user for search',
  })
  @Index()
  appNo!: string;

  @Column({
    type: 'bigint',
    comment: 'role no for user',
  })
  @Index()
  roleNo!: string;

  @Column({
    length: 32,
    comment: 'chars randomStr for security reason',
  })
  nonce!: string;

  @Column({
    length: 80,
    comment: 'use accountName',
  })
  @Index()
  accountName!: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'use mobile no',
    nullable: true,
  })
  @Index()
  mobileNo: string | null = null;

  @Column({
    type: 'varchar',
    length: 80,
    comment: 'use email',
    nullable: true,
  })
  @Index()
  emailAddr: string | null = null;

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
  optKey: string | null = null;

  @Column({
    type: 'bool',
    comment: 'twoFactorAuth',
    default: false,
  })
  twoFactorAuth = false;

  @Column({
    type: 'varchar',
    length: 200,
    comment: 'user header image (abs)path',
    nullable: true,
  })
  headerImg: string | null = null;

  @Column({
    type: 'smallint',
    comment: 'the user login error times',
    default: 0,
  })
  loginErrTimes = 0;

  @Column({
    type: 'varchar',
    length: 20,
    default: '127.0.0.1',
  })
  registerIP = '127.0.0.1';

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.NORMAL,
  })
  @Index()
  status: UserStatus = UserStatus.NORMAL;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
