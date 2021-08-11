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
    length: 80,
  })
  key!: string;

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
