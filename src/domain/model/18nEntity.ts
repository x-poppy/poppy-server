import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

@Entity('pp_i18n')
export class I18nEntity {
  @PrimaryColumn({
    length: 80,
  })
  locale!: string;

  @PrimaryColumn({
    length: 80,
  })
  key!: string;

  @PrimaryColumn({
    type: 'bigint',
    comment: 'appNo',
  })
  appNo!: string;

  @Column({
    length: 500,
    nullable: true,
  })
  value: string | null = null;

  @Column({
    type: 'text',
  })
  desc: string | null = null;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
