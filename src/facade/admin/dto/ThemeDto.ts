export class CreateThemeDto {
  key!: string;
  value!: string;
  desc?: string;
}

export class UpdateThemeDto {
  key!: string;
  value!: string;
  desc?: string;
}

export class ListThemeDto {
  key?: string;
  offset!: number;
  size!: number;
}

export class DeleteThemeDto {
  id!: string;
}

export class ThemeBundleDto {
  appNo!: string;
  locale!: string;
}
