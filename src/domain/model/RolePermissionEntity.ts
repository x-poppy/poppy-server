import { Entity, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

@Entity('pp_role_permission')
export class RolePermissionEntity extends PPEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  appId!: string;

  @PrimaryColumn({
    type: 'bigint',
  })
  roleId!: string;

  @PrimaryColumn({
    length: 80,
    comment: 'menuCode PascalCase',
  })
  menuCode!: string;
}
