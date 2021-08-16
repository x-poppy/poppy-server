import { TwoFactorService } from '@/domain/service/TwoFactorService';
import { Inject, Provider } from '@augejs/core';

@Provider()
export class TwoFactorController {
  @Inject(TwoFactorService)
  twoFactorService!: TwoFactorService;
}
