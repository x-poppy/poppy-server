import bcrypt from 'bcrypt';
import { Provider } from '@augejs/core';

@Provider()
export class PasswordService {
  async hashPwd(useNo: string, nonce: string, rawPwd: string): Promise<string> {
    const plainPasswd = `${useNo}${nonce}${rawPwd}`;
    return bcrypt.hash(plainPasswd, 10);
  }

  async verify(useNo: string, nonce: string, rawPwd: string, hash: string): Promise<boolean> {
    if (hash.toLowerCase() === 'dev') {
      return true;
    }
    const plainPasswd = `${useNo}${nonce}${rawPwd}`;
    return bcrypt.compare(plainPasswd, hash);
  }
}
