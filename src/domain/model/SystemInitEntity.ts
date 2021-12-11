import { Column, Entity, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';
@Entity('pp_system_init')
export class SystemInitEntity extends PPEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  id!: string;

  @Column({
    type: 'text',
  })
  initSql: string | null = null;
}
