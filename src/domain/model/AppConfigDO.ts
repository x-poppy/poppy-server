import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { MaxLength } from '@augejs/validator';
import { PPDO } from './PPDO';

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    key: { type: 'string' },
    value: { type: 'string' },
    desc: { type: 'string' },
  },
})
@Entity('pp_app_config')
@Index(['appId', 'key'], { unique: true })
export class AppConfigDO extends PPDO {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'id',
  })
  id!: string;

  @Column({
    type: 'bigint',
    comment: 'appId',
  })
  appId!: string;

  @Column({
    length: 80,
    comment: 'key name',
  })
  @MaxLength(80)
  key!: string;

  @Column({
    length: 200,
  })
  @MaxLength(80)
  value!: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  @MaxLength(120)
  desc: string | null = null;
}
