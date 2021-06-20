import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum AppStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_app')
export class AppEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  appNo!: string;

  @Column({
    type: 'bigint',
    comment: 'orgNo for app, null means no org',
    nullable: true
  })
  orgNo!: string | null;

  @Column({
    type: 'bigint',
    comment: 'role no for app',
  })
  roleNo!: string;

  @Column({
    type: 'varchar',
    length: 80,
    default: 'en_US',
    comment: 'locale for app',
  })
  locale = 'en_US';

  @Column({
    type: 'varchar',
    length: 200,
    comment: 'app icon image (abs)path',
    nullable: true,
  })
  icon: string | null = null;

  @Column({
    length: 80,
    comment: 'user display nick name',
  })
  displayName!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string | null = null;

  @Column({
    type: 'enum',
    enum: AppStatus,
    default: AppStatus.NORMAL,
  })
  @Index()
  status!: AppStatus;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  get isTop(): boolean {
    return !this.orgNo;
  }
}
