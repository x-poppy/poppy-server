import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from '@augejs/typeorm';

@Entity('pp_operation_log')
export class OperationLogEntity {
  @PrimaryGeneratedColumn()
  id!: bigint;

  @Column({
    type: 'bigint',
    comment: 'appNo SnowflakeNo format',
  })
  appNo!: string;

  @Column({
    type: 'bigint',
    comment: 'orgNo for user',
  })
  orgNo!: string;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
