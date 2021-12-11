import { SwaggerDefinition } from '@augejs/koa-swagger';
import { AfterLoad, Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

export enum AppStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    parent: { type: 'string' },
    status: {  type: 'string', enum: ['normal', 'disabled'] },
    expireAt: {type: 'string' }
  },
})
@Entity('pp_app')
export class AppEntity extends PPEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  id!: string;

  @Column({
    type: 'bigint',
    comment: 'parent for app 0 means no parent',
    default: '0',
  })
  @Index()
  parent!: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
    default: null,
    comment: 'app icon image (abs) path 300 * 300',
  })
  logoImg: string | null = null;

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
    type: 'smallint',
    comment: 'app level',
    default: 0,
  })
  level = 0;

  @Column({
    type: 'enum',
    enum: AppStatus,
    default: AppStatus.NORMAL,
  })
  @Index()
  status!: AppStatus;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expireAt!: Date;

  isExpired = false;

  @AfterLoad()
  updateIsExpired(): void {
    this.isExpired = Date.now() > this.expireAt.getTime();
  }
}
