import { Provider } from '@augejs/core';
import { Prefix } from '@augejs/koa';

@Prefix('/api/v1/user/security')
@Provider()
export class SecurityCenterController {}
