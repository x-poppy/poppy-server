import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum AppDomainStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_app_domain')
export class AppDomainEntity {
  @PrimaryColumn({
    length: 80,
  })
  domain!: string;

  @PrimaryColumn({
    length: 80,
  })
  domain!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo',
  })
  appNo!: string;

  @Column({
    type: 'enum',
    enum: AppDomainStatus,
    default: AppDomainStatus.NORMAL,
  })
  @Index()
  status!: AppDomainStatus;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
