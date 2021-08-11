import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum ProxyServerStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_server_hook')
export class ServerProxyEntity {
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
    type: 'simple-array',
    comment: 'server urls',
  })
  serverUrl!: string[];

  @Column({
    type: 'simple-json',
    comment: 'extraParams',
  })
  extraParams!: Record<string, unknown>;

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
    enum: ProxyServerStatus,
    default: ProxyServerStatus.NORMAL,
  })
  @Index()
  status: ProxyServerStatus = ProxyServerStatus.NORMAL;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
