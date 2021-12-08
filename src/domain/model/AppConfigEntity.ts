import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

@Entity('pp_app_config')
@Index('idx_app_key', ['appNo', 'key'], { unique: true })
export class AppConfigEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'id',
  })
  id!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo null means common app',
  })
  @Index()
  appNo!: string;

  @Column({
    length: 80,
    comment: 'key name',
  })
  key!: string;

  @Column({
    length: 500,
  })
  value!: string;

  @Column({
    length: 500,
    nullable: true,
  })
  desc: string | null = null;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
