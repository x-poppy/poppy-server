export type ErrorValues = Record<string, string | number | boolean | null | undefined | Date>;

interface ErrorOpts {
  errorMessageValues?: ErrorValues;
  errorDetail?: any;
}

export class BusinessError extends Error {
  errorMessage: string;
  errorMessageValues: ErrorValues | null;
  errorDetail: any | null;

  constructor(errorMessage: string, opts?: ErrorOpts) {
    super();
    this.errorMessage = errorMessage;
    this.errorMessageValues = opts?.errorMessageValues ?? null;
    this.errorDetail = opts?.errorDetail ?? null;
  }
}

export class ClientValidationError extends Error {
  errorMessage: string;
  errorMessageValues: ErrorValues | null;
  errorDetail: any | null;

  constructor(errorMessage: string, opts?: ErrorOpts) {
    super();
    this.errorMessage = errorMessage;
    this.errorMessageValues = opts?.errorMessageValues ?? null;
    this.errorDetail = opts?.errorDetail ?? null;
  }
}
