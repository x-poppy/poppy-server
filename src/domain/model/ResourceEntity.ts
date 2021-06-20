import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, TreeChildren, TreeParent, UpdateDateColumn } from '@augejs/typeorm';

export enum ResourceStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum ResourceType {
  PAGE = 'page',
  MENU = 'menu',
  FUNCTION = 'func',
}

@Entity('pp_resource')
export class ResourceEntity {
  @PrimaryColumn({
    length: 80,
    comment: 'resource code',
  })
  resourceCode!: string;

  @Index()
  @Column({
    type: 'bigint',
    comment: 'appNo for org',
  })
  appNo!: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
    comment: 'parent resource code',
  })
  @Index()
  parent!: string | null;

  @Column()
  type!: ResourceType;

  @Column({
    length: 200,
    comment: 'icon',
    nullable: true,
  })
  icon!: string;

  @Column({
    type: 'int',
    comment: 'sort priority',
  })
  priority!: number;

  @PrimaryColumn({
    length: 80,
  })
  label!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string | null = null;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.NORMAL,
  })
  @Index()
  status: ResourceStatus = ResourceStatus.NORMAL;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
