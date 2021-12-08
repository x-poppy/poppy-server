import { KoaContext } from '@augejs/koa';
import { LoginDto } from '../dto/LoginDto';
import { SessionController } from './SessionController';

describe('SessionController', () => {
  it('login', async () => {
    const sessionController = new SessionController();
    const loginDto = new LoginDto();
    const context = {} as KoaContext;
    // const result = await sessionController.login(context, loginDto);
    // expect(result.token).not.toBeNull();
  });
});
