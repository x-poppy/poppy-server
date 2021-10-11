import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum MenuStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum MenuType {
  MENU = 'menu',
  MENU_ITEM = 'menuItem',
  MENU_ITEM_WIDGET = 'menuItemWidget',
}

@Entity('pp_menu')
export class MenuEntity {
  @PrimaryColumn({
    length: 80,
    comment: 'menu code',
    unique: true,
  })
  menuCode!: string;

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
    enum: MenuType,
  })
  @Index()
  type!: MenuType;

  @Column({
    type: 'varchar',
    length: 512,
    default: null,
    comment: 'used for navigation',
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
    comment: 'is menu is cover by permission',
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
    enum: MenuStatus,
    default: MenuStatus.NORMAL,
  })
  @Index()
  status: MenuStatus = MenuStatus.NORMAL;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
