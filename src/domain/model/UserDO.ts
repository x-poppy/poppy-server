import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Entity, PrimaryColumn, Column, Index } from '@augejs/typeorm';
import { PPDO } from './PPDO';

export enum UserStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
  LOCKED = 'locked',
}

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    roleId: { type: 'string' },
    accountName: { type: 'string' },
    headerImg: { type: 'string' },
    registerIP: { type: 'string' },
    appLevel: { type: 'number' },
    mobileNo: { type: 'string' },
    status: {  type: 'string', enum: ['normal', 'disabled'] },
    expireAt: {type: 'string' }
  },
})
@Entity('pp_user')
@Index(['appId', 'accountName'], { unique: true })
export class UserDO extends PPDO {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  id!: string;

  @Column({
    type: 'bigint',
  })
  @Index()
  appId!: string;

  @Column({
    type: 'bigint',
  })
  @Index()
  roleId!: string;

  @Column({
    length: 256,
    comment: 'use accountName',
  })
  @Index()
  accountName!: string;

  @Column({
    type: 'varchar',
    length: 256,
    comment: 'use email',
    nullable: true,
  })
  @Index()
  emailAddr: string | null = null;

  @Column({
    type: 'varchar',
    length: 64,
    comment: 'the format +213 551234567',
    nullable: true,
  })
  @Index()
  mobileNo: string | null = null;

  @Column({
    type: 'smallint',
    default: 0,
  })
  @Index()
  appLevel = 0;

  @Column({
    type: 'varchar',
    length: 512,
    comment: 'user header image abs path',
    nullable: true,
  })
  headerImg: string | null = null;

  @Column({
    type: 'varchar',
    length: 20,
    default: '127.0.0.1',
  })
  @Index()
  registerIP!: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.NORMAL,
  })
  @Index()
  status!: UserStatus;
}

