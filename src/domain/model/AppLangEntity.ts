import { SwaggerDefinition } from "@augejs/koa-swagger";
import { Entity, PrimaryColumn } from "@augejs/typeorm";
import { PPEntity } from "./PPEntity";

@SwaggerDefinition({
  properties: {
    appId: { type: 'string' },
    locale: { type: 'string' },
    name: { type: 'string' },
    icon: { type: 'string' },
  },
})
@Entity('pp_app_lang')
export class AppLangEntity extends PPEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  appId!: string;

  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    comment: 'Country Code',
  })
  locale!: string;

  // the two is comes from the LangEntity;
  name!: string;
  icon: string | null = null;
}
