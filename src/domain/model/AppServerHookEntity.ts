import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum AppProxyServerStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_app_server_hook')
export class AppServerProxyEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format 0 means global',
  })
  appNo!: string;

  @PrimaryColumn({
    comment: 'event name',
  })
  eventName!: string;

  @Column({
    length: 500,
    comment: 'server urls',
  })
  serverUrl!: string;

  @Column({
    type: 'smallint',
    comment: 'timeout for server',
  })
  timeout = 0;

  @Column({
    length: 80,
    comment: 'user display nick name',
  })
  displayName!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string | null = null;

  @Column({
    type: 'enum',
    enum: AppProxyServerStatus,
    default: AppProxyServerStatus.NORMAL,
  })
  @Index()
  status: AppProxyServerStatus = AppProxyServerStatus.NORMAL;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
