import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum AppThemeStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_app_theme')
export class AppThemeEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  appNo!: string;

  @PrimaryColumn({
    type: 'varchar',
    length: 80,
    comment: 'theme variable name camelCase',
  })
  key!: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    default: null,
  })
  value: string | null = null;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string | null = null;

  @Column({
    type: 'enum',
    enum: AppThemeStatus,
    default: AppThemeStatus.NORMAL,
  })
  @Index()
  status!: AppThemeStatus;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
