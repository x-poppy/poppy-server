import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

export enum CustomizedServiceStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum CustomizedServiceCode {
  SMS = 'sms',
  EMAIL = 'email',
  OTP = 'otp',
  LOGIN = 'login',
  AVATAR = 'avatar',
  LOGO = 'logo'
}

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    locale: { type: 'string' },
    value: { type: 'string' },
  },
})
@Entity('pp_customized_service')
@Index(['appId', 'serviceCode'], { unique: true })
export class CustomizedServiceEntity  extends PPEntity {
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
    type: 'varchar',
    length: 80,
    nullable: true
  })
  titleI18nKey: string | null = null;

  @Column({
    length: 80,
    comment: 'serviceCode is semantic'
  })
  serviceCode!: string;

  @Column({
    length: 20,
    comment: 'moduleCode is used for code implements'
  })
  @Index()
  moduleCode!: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true
  })
  apiUrl: string | null = null;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true
  })
  callbackApiUrl: string | null = null;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true
  })
  extApiUrl: string | null = null;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true
  })
  account: string | null = null;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true
  })
  extAccount: string | null = null;

  @Column({
    type: 'text',
    nullable: true
  })
  priKey: string | null = null;

  @Column({
    type: 'text',
    nullable: true
  })
  pubKey: string | null = null;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'the others keys'
  })
  extKey: string | null = null;

  @Column({
    type: 'json',
    nullable: true
  })
  extParams: Record<string, unknown> | null = null;

  @Column({
    length: 512,
  })
  desc!: string;

  @Column({
    type: 'enum',
    enum: CustomizedServiceStatus,
    default: CustomizedServiceStatus.NORMAL,
  })
  @Index()
  status!: CustomizedServiceStatus;
}
