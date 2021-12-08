import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

@Entity('pp_theme')
@Index('idx_app_key', ['appNo', 'key'], { unique: true })
export class ThemeEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  id!: string;

  @Column({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  appNo!: string;

  @Column({
    length: 80,
    comment: 'i18n key',
  })
  key!: string;

  @Column({
    select: false,
    type: 'simple-json',
    nullable: true,
  })
  value: string | null = null;

  @Column({
    length: 500,
    nullable: true,
  })
  desc: string | null = null;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
