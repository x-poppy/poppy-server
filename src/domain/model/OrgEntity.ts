import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum OrgStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_org')
export class OrgEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  orgNo!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo for org',
  })
  appNo!: string;

  @Column({
    type: 'enum',
    enum: OrgStatus,
    default: OrgStatus.NORMAL,
  })
  @Index()
  status!: OrgStatus;

  @Column({
    type: 'bigint',
    comment: 'parent null means no parent',
    nullable: true,
  })
  @Index()
  parent: string | null = null

  @Column({
    type: 'smallint',
    comment: 'org level',
    default: 0,
  })
  level = 0;

  @Column({
    type: 'varchar',
    length: 200,
    comment: 'icon image (abs)path',
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

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
