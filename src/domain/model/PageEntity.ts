import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from '@augejs/typeorm';

export enum PageStatus {
  DISABLED = 'disabled',
  NORMAL = 'normal',
}

export enum PageContentType {
  BuildIn = ' buildIn',
  HTML_URL = 'htmlUrl',
  HTML_SRC = 'htmlSource',
  Markdown = 'markdown',
  Editor = 'editor',
}

@Entity('pp_page')
export class PageEntity {
  @PrimaryColumn({
    type: 'bigint',
    comment: 'pk SnowflakeNo format',
  })
  pageNo!: string;

  @Column({
    type: 'bigint',
    comment: 'appNo',
  })
  @Index()
  appNo!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title!: string;

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
    enum: PageContentType,
    default: PageContentType.HTML_URL,
  })
  @Index()
  contentType!: PageContentType;

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
