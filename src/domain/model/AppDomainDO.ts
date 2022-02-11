import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPDO } from './PPDO';

export enum AppDomainStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    domain: { type: 'string', description: 'domain' },
    status: { type: 'string', enum: ['normal', 'disabled'] },
  },
})
@Entity('pp_app_domain')
export class AppDomainDO extends PPDO {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'id',
  })
  id!: string;

  @Column({
    length: 80,
  })
  @Index({ unique: true })
  domain!: string;

  @Column({
    type: 'bigint',
    comment: 'appId',
  })
  appId!: string;

  @Column({
    type: 'enum',
    enum: AppDomainStatus,
    default: AppDomainStatus.NORMAL,
  })
  @Index()
  status!: AppDomainStatus;
}
