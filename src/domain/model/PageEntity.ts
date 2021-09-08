import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum PageStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum PageType {
  BUILD_IN = ' buildIn',
  HTML_URL = 'htmlUrl',
  HTML_SOURCE = 'htmlSource',
  MARK_DOWN = 'markdown',
}

@Entity('pp_page')
export class PageEntity {
  @PrimaryColumn({
    length: 80,
    comment: 'unique page code for page can be equals to resource code',
  })
  pageCode!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo',
  })
  @Index()
  appNo!: string;

  @Column({
    type: 'text',
    nullable: true,
    select: false,
  })
  content: string | null = null;

  @Column({
    type: 'enum',
    enum: PageStatus,
    default: PageStatus.NORMAL,
  })
  @Index()
  status!: PageStatus;

  @Column({
    type: 'enum',
    enum: PageType,
    default: PageType.HTML_URL,
  })
  @Index()
  type!: PageType;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string | null = null;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
