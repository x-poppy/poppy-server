import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

export enum RoleStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    appLevel: { type: 'number' },
    parent: { type: 'string' },
    inherited: { type: 'boolean' },
    title: { type: 'string' },
    status: { type: 'string', description: `${Object.values(RoleStatus).join(',')}` }
  },
})
@Entity('pp_role')
export class RoleEntity extends PPEntity {
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
    comment: 'parent for role null means no parent',
    default: '0',
  })
  @Index()
  parent!: string;

  @Column({
    type: 'smallint',
    default: 0,
  })
  @Index()
  appLevel = 0;

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
    comment: 'level',
    default: 0,
  })
  @Index()
  level = 0;

  @Column({
    type: 'enum',
    enum: RoleStatus,
    default: RoleStatus.NORMAL,
  })
  @Index()
  status!: RoleStatus;
}
