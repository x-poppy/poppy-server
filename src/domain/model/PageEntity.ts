import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum PageStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

@Entity('pp_page')
export class PageEntity {
  @PrimaryColumn({
    length: 80,
    comment: 'unique page name',
  })
  pageName!: string;

  @Column('simple-json')
  schema!: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.NORMAL,
  })
  @Index()
  status!: PageStatus;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
