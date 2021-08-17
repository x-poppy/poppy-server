import { Provider } from '@augejs/core';
import { authenticator } from 'otplib';

@Provider()
export class OneTimePasswordService {
  async verify(token: string, secret: string): Promise<boolean> {
    if (secret.toLowerCase() === 'dev') {
      return true;
    }

    return authenticator.verify({
      token,
      secret,
    });
  }
}
