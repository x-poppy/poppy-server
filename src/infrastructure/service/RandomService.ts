import crypto from 'crypto';
import { Provider } from "@augejs/core";

@Provider()
export class RandomService {
  nonce(length = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
