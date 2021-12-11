import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

export enum MenuStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum MenuType {
  MENU = 'menu',
  MENU_ITEM = 'menuItem',
  MENU_ITEM_PERM = 'menuItemPerm',
}

export enum MenuPermissionType {
  // no permission means app and sub-apps will has this menu
  NO_PERMISSION = 'noPerm',
  // without permissions only same app will has this menu
  WITHOUT_PERMISSION = 'withoutPerm',
  // this menu
  WITH_PERMISSION = 'withPerm'
}

@Entity('pp_menu')
@Index(['appId', 'menuCode'], { unique: true })
export class MenuEntity extends PPEntity {

  @PrimaryColumn({
    type: 'bigint',
  })
  id!: string;

  @Column({
    length: 80,
    comment: 'readable menu code',
    unique: true,
  })
  menuCode!: string;

  @Column({
    type: 'bigint',
  })
  appId!: string;

  @Column({
    type: 'smallint',
    comment: 'app level',
    default: 0,
  })
  appLevel = 0;

  @Column({
    type: 'bigint',
    default: '0',
  })
  @Index()
  parent!: string;

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

  // no permission menu will pass though all the inherited tree
  // this filed is only for menuItem
  @Column({
    type: 'enum',
    enum: MenuPermissionType,
    comment: 'indicate the menu is not cover by permission',
    default: MenuPermissionType.NO_PERMISSION,
  })
  @Index()
  permissionType = MenuPermissionType.NO_PERMISSION;

  @Column({
    type: 'int',
    comment: 'sort priority more bigger more front',
    default: 0,
  })
  priority = 0;

  @Column({
    type: 'varchar',
    length: 120,
  })
  @Index()
  title!: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true
  })
  titleI18nKey: string | null = null;

  @Column({
    type: 'enum',
    enum: MenuStatus,
    default: MenuStatus.NORMAL,
  })
  @Index()
  status!: MenuStatus;
}
