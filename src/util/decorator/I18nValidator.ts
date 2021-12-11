import { ErrorValues } from '../BusinessError';

export function I18nValidatorDecorator(): ClassDecorator {
  return (target: NewableFunction) => {
    target.prototype.errorMessageKey = null;
    target.prototype.errorMessageValues = null;
  };
}

export interface I18nValidatorOwner {
  errorMessageKey: string | null;
  errorMessageValues: ErrorValues | null;
}
