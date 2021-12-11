import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    key: { type: 'string' },
    value: { type: 'string' },
  },
})
@Entity('pp_theme')
@Index(['appId', 'key'], { unique: true })
export class ThemeEntity extends PPEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  id!: string;

  @Column({
    type: 'bigint',
  })
  appId!: string;

  @Column({
    length: 80,
    comment: 'key',
  })
  key!: string;

  @Column({
    length: 120,
  })
  value!: string;
}
