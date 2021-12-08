import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';
@Entity('pp_i18n')
@Index('idx_app_locale_key', ['appNo', 'locale', 'key'], { unique: true })
export class I18nEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'id',
  })
  id!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo',
  })
  appNo!: string;

  @Column({
    length: 80,
  })
  locale!: string;

  @Column({
    length: 80,
    comment: 'i18n key',
  })
  key!: string;

  @Column({
    length: 80,
    comment: 'i18n message',
  })
  value: string | null = null;

  @Column({
    length: 500,
  })
  desc: string | null = null;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
