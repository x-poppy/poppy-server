import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum RoleStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_role')
export class RoleEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  roleNo!: string;

  @Column({
    type: 'bigint',
    comment: 'parent for role null means no parent',
    nullable: true,
  })
  parent: string | null = null;

  @Column({
    type: 'boolean',
    comment: 'is inherited permissions from parent',
    default: false,
  })
  inherited = false;

  @Column({
    type: 'bigint',
    comment: 'orgNo for user',
    nullable: true,
  })
  orgNo!: string | null;

  @Column({
    type: 'bigint',
    comment: 'appNo for role',
  })
  appNo!: string;

  @Column({
    type: 'boolean',
    comment: 'has app level resource permissions',
    default: false,
  })
  hasAppResPerms = false;

  @Column({
    length: 80,
    comment: 'user display nick name',
  })
  displayName!: string;

  @Column({
    type: 'smallint',
    comment: 'level',
    default: 0,
  })
  level = 0;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string | null = null;

  @Column({
    type: 'enum',
    enum: RoleStatus,
    default: RoleStatus.NORMAL,
  })
  @Index()
  status: RoleStatus = RoleStatus.NORMAL;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
