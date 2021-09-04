import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

@Entity('pp_system_init')
export class SystemInitEntity {
  @PrimaryColumn({
    type: 'smallint',
    default: 0,
  })
  id = 0;

  @Column({
    type: 'text',
    nullable: true,
  })
  initSql: string | null = null;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
