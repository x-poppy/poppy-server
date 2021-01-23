import { II18n } from '@augejs/i18n';
import { ErrorCodeEnum } from './ErrorCodeEnum';
import { formatErrorMessage } from '@/utils/formatErrorMessage';
export class ServiceError extends Error {
  errorCode: string;

  constructor(i18n: II18n, errorCode: ErrorCodeEnum | string, message?: any) {
    message = formatErrorMessage(i18n, errorCode, message);
    super(message);
    this.name = ServiceError.name;
    this.errorCode = errorCode;
  }
}
