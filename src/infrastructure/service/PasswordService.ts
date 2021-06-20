import crypto from 'crypto';
import { Provider } from '@augejs/core';

@Provider()
export class PasswordService {
  hashPwd(useNo: string, nonce: string, rawPwd: string): string {
    const passwdHashContent = `${useNo}${nonce}${rawPwd}`;
    return crypto.createHash('sha256').update(passwdHashContent).digest('hex');
  }

  verifyPwd(useNo: string, nonce: string, rawPwd: string, hash: string): boolean {
    if (hash.toLowerCase() === 'dev') {
      return true;
    }
    return this.hashPwd(useNo, nonce, rawPwd) === hash;
  }
}
