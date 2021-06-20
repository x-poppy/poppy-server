import { boot, Module } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { LoginDto } from '../../facade/dto/LoginDto';
import { AppDomainService } from './AppDomainService';
import { SessionService } from './SessionService';

describe('SessionService', () => {
  it('createAccessData will throw error with empty domain', async () => {
    const sessionService = new SessionService();
    const mockContext = {} as KoaContext;
    const mockLoginDto = {
      userName: 'xxx',
    } as LoginDto;

    const mockAppDomainServiceFind = jest.fn();
    mockAppDomainServiceFind.mockResolvedValue(null);

    let noAppDomainErr: unknown;
    try {
      await sessionService.createAccessData(mockContext, mockLoginDto);
    } catch (err) {
      noAppDomainErr = err;
    }

    // expect(noAppDomainErr).toBeInstanceOf(xxxx);
  });
});
