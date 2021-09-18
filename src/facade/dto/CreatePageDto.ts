import { PageContentType } from '@/domain/model/PageEntity';

export class CreatePageDto {
  title!: string;
  content!: string | null;
  contentType!: PageContentType;
  desc!: string | null;
}
