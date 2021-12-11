import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

@SwaggerDefinition({
  properties: {
    id: { type: 'string' },
    appId: { type: 'string' },
    locale: { type: 'string' },
    value: { type: 'string' },
  },
})
@Entity('pp_i18n')
@Index(['appId', 'locale', 'key'], { unique: true })
export class I18nEntity  extends PPEntity {
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
    length: 80,
  })
  locale!: string;

  @Column({
    length: 80
  })
  key!: string

  @Column({
    length: 128
  })
  value!: string
}
