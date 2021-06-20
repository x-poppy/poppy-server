type ErrorValues = Record<string, string | number | boolean | null | undefined | Date>;
type ErrorDetail = Record<string, unknown>;

interface BusinessErrorOpts {
  errorMessage: string;
  errorValues?: ErrorValues;
  errorDetail?: ErrorDetail;
}

export class BusinessError extends Error {
  errorMessage: string;
  errorMessageValues: ErrorValues | null;
  errorDetail: ErrorDetail | null;

  constructor(errorMessage: string, opts?: BusinessErrorOpts) {
    super();
    this.errorMessage = errorMessage;
    this.errorMessageValues = opts?.errorValues ?? null;
    this.errorDetail = opts?.errorDetail ?? null;
  }
}
