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
    comment: 'parent for app null means no parent',
    nullable: true,
  })
  @Index()
  parent: string | null = null;

  @Column({
    type: 'smallint',
    comment: 'app level',
    default: 0,
  })
  @Index()
  level = 0;

  @Column({
    type: 'bigint',
    comment: 'role no for app',
  })
  roleNo!: string;

  @Column({
    type: 'varchar',
    length: 6,
    default: null,
    comment: 'locale for app if this value is null and the local will decide by client',
    nullable: true,
  })
  locale: string | null = null;

  @Column({
    type: 'varchar',
    length: 200,
    comment: 'app icon image (abs)path 300 * 300',
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
    type: 'varchar',
    length: 128,
    comment: 'The ICP for app',
    nullable: true,
  })
  icp: string | null = null;

  @Column({
    type: 'enum',
    enum: AppStatus,
    default: AppStatus.NORMAL,
  })
  @Index()
  status!: AppStatus;

  @Column({
    type: 'datetime',
    width: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  expireAt!: Date;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  get isExpired(): boolean {
    return Date.now() > this.expireAt.getTime();
  }
}
