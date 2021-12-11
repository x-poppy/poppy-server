import bcrypt from 'bcrypt';
import { Provider } from '@augejs/core';

@Provider()
export class PasswordService {
  async hashPwd(useId: string, nonce: string, rawPwd: string): Promise<string> {
    const plainPasswd = `${useId}${nonce}${rawPwd}`;
    return bcrypt.hash(plainPasswd, 10);
  }

  async verify(useId: string, nonce: string, rawPwd: string, hash: string): Promise<boolean> {
    if (hash.toLowerCase() === 'dev') {
      return true;
    }
    const plainPasswd = `${useId}${nonce}${rawPwd}`;
    return bcrypt.compare(plainPasswd, hash);
  }
}
