import { Column, Entity, PrimaryColumn } from '@augejs/typeorm';
import { PPDO } from './PPDO';
@Entity('pp_system_init')
export class SystemInitDO extends PPDO {
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
