import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum ResourceStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum ResourceType {
  FUNCTION = 'function',
  PAGE = 'page',
  PERM = 'perm',
  MENU = 'menu',
}

export enum ResourcePosition {
  HOME = 'home',
  HEAD = 'head',
  None = 'none',
}

@Entity('pp_resource')
export class ResourceEntity {
  @PrimaryColumn({
    length: 80,
    comment: 'resource code',
  })
  resourceCode!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo',
  })
  @Index()
  appNo!: string;

  @Column({
    type: 'smallint',
    comment: 'app level',
    default: 0,
  })
  @Index()
  appLevel = 0;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
    comment: 'parent resource code',
    default: null,
  })
  @Index()
  parent: string | null = null;

  @Column({
    type: 'enum',
    enum: ResourceType,
  })
  @Index()
  type!: ResourceType;

  @Column({
    type: 'enum',
    enum: ResourcePosition,
  })
  @Index()
  position!: ResourcePosition;

  @Column({
    type: 'varchar',
    length: 255,
    default: null,
  })
  linkUrl: string | null = null;

  @Column({
    type: 'varchar',
    length: 200,
    comment: 'icon',
    nullable: true,
  })
  icon: string | null = null;

  @Column({
    type: 'boolean',
    comment: 'is resource is cover by permission',
    default: true,
  })
  @Index()
  hasPermission = true;

  @Column({
    type: 'int',
    comment: 'sort priority',
  })
  priority!: number;

  @Column({
    type: 'varchar',
    length: 80,
  })
  label!: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  i18nLabelKey: string | null = null;

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
