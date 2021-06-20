import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

@Entity('pp_i18n')
@Index('idx_local_key', ['locale', 'key'], { unique: true })
export class I18nEntity {
  @PrimaryColumn({
    length: 80,
  })
  locale!: string;

  @PrimaryColumn({
    length: 80,
  })
  key!: string;

  @Column({
    length: 500,
  })
  value = '';

  @Column({
    type: 'text',
  })
  desc: string | null = null;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
