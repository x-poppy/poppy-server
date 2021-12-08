export class CreateI18nDto {
  locale!: string;
  key!: string;
  value!: string;
  desc?: string;
}

export class ListI18nDto {
  locale?: string;
  key?: string;
  offset!: number;
  size!: number;
}

export class DeleteI18nDto {
  id!: string;
}

export class UpdateI18nDto {
  id!: string;
  locale?: string;
  key?: string;
  value?: string;
  desc?: string;
}

export class MessageBundleDto {
  appNo!: string;
  locale!: string;
}
