import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum AppProxyServerStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_app_server_proxy')
export class AppServerProxyEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format 0 means global',
  })
  appNo!: string;

  @PrimaryColumn({
    type: 'bigint',
    comment: 'server name',
  })
  serverName!: string;

  @Column({
    length: 500,
    comment: 'server urls',
  })
  serverUrl!: string;

  @Column({
    type: 'int',
    comment: 'timeout for server',
    default: 60000,
  })
  timeout = 60000;

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
