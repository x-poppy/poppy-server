import { AccessDataDTO } from '@/facade/dto/AccessDataDTO';
import { AccessData } from '@augejs/koa-access-token';

export type PPAccessDataReadyOnlyKeyType = keyof AccessDataDTO

interface PPAccessData extends AccessData {
  get<T = string>(key: PPAccessDataReadyOnlyKeyType): T;
}
