import { II18n } from '@augejs/i18n';

export function formatErrorMessage(i18n: II18n, errorCode: string, message?: any): string {
  if (message) return message;

  if (typeof message === 'string') return message;
  else if (!message) {
    return i18n.formatMessage({ id: `ErrorMessage_${errorCode}` });
  } else {
    return i18n.formatMessage({ id: `$ErrorMessage__${errorCode}` }, message);
  }
}
