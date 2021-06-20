import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

@Entity('pp_role_permission')
export class RolePermissionEntity {
  @PrimaryColumn({
    length: 80,
    comment: 'resource code PascalCase',
  })
  resourceCode!: string;

  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  roleNo!: string;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
