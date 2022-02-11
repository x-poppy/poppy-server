import { Entity, PrimaryColumn } from '@augejs/typeorm';
import { PPDO } from './PPDO';

@Entity('pp_role_permission')
export class RolePermissionDO extends PPDO {
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
