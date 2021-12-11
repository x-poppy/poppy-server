import { Column, Entity, PrimaryColumn } from "@augejs/typeorm";
import { PPEntity } from "./PPEntity";

@Entity('pp_lang')
export class LangEntity  extends PPEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 10,
    comment: 'Country & Locale',
  })
  locale!: string;

  @Column({
    type: 'varchar',
    length: 20,
    comment: 'Locale Title',
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: 18,
    comment: 'Country Icon',
    nullable: true
  })
  icon: string | null = null;
}
