import { Column, Entity, PrimaryColumn } from "@augejs/typeorm";
import { PPDO } from "./PPDO";

@Entity('pp_lang')
export class LangDO  extends PPDO {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    comment: 'Country & Locale',
  })
  locale!: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'name',
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 18,
    comment: 'Country Icon',
    nullable: true
  })
  icon: string | null = null;
}
