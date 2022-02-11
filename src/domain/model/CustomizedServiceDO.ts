import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPDO } from './PPDO';

export enum CustomizedServiceStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum CustomizedServiceCode {
  SMS = 'sms',
  Email = 'email',
  OTP = 'otp',
  Login = 'login',
  Avatar = 'avatar',
  TwoFactorAuth = 'twoFactorAuth',
  Logo = 'logo'
}

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    icon: { type: 'string' },
    title: { type: 'string' },
    serviceCode: { type: 'string' },
    moduleCode: { type: 'string' },
    apiUrl: { type: 'string' },
    apiKey: { type: 'string' },
    timeout: { type: 'number' },
    status: { type: 'string' }
  },
})
@Entity('pp_customized_service')
@Index(['appId', 'serviceCode'], { unique: true })
export class CustomizedServiceDO  extends PPDO {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'id',
  })
  id!: string;

  @Column({
    type: 'bigint',
  })
  appId!: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
    default: null,
    comment: 'app icon image (abs) path 300 * 300',
  })
  icon: string | null = null;

  @Column({
    type: 'varchar',
    length: 120,
    comment: 'title',
  })
  @Index()
  title!: string;

  @Column({
    length: 80,
    comment: 'serviceCode is semantic'
  })
  serviceCode!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: null,
    comment: 'moduleCode is used for code implements'
  })
  @Index()
  moduleCode: string | null = null;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    default: null,
  })
  apiUrl: string | null = null;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    default: null,
  })
  apiKey: string | null = null;

  @Column({
    type: 'int',
    default: 0
  })
  timeout = 0;

  @Column({
    type: 'json',
  })
  parameters: Record<string, unknown> = {};

  @Column({
    type: 'json',
  })
  credentials: Record<string, unknown> = {};

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  mockResponse: string | null = null;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    default: null,
  })
  desc: string | null = null;

  @Column({
    type: 'enum',
    enum: CustomizedServiceStatus,
    default: CustomizedServiceStatus.NORMAL,
  })
  @Index()
  status!: CustomizedServiceStatus;
}
