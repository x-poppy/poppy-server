import { Column, Entity, Index, PrimaryColumn } from '@augejs/typeorm';
import { PPEntity } from './PPEntity';

@Entity('pp_operation_log')
@Index(['createAt'])
export class OperationLogEntity extends PPEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'id',
  })
  id!: string;

  @Column({
    type: 'bigint',
  })
  @Index()
  appId!: string;

  @Column({
    length: 128,
  })
  @Index()
  operator!: string;

  @Column({
    type: 'smallint',
    default: 0,
    comment: 'viewLevel is used for view permission'
  })
  @Index()
  viewLevel = 0;

  @Column({
    length: 256,
  })
  @Index()
  action!: string;

  @Column({
    length: 128,
  })
  @Index()
  operatorIP!: string;

  @Column({
    type: 'text',
    nullable: true
  })
  content: string | null = null;
}
