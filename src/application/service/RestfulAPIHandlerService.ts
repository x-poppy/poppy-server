import { BusinessError, ClientValidationError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';
import { HttpStatus, KoaContext } from '@augejs/koa';

@Provider()
export class RestfulAPIHandlerService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  async handlerSuccess(ctx: KoaContext): Promise<void> {
    this.logger.info(ctx.url);
  }

  async handlerError(ctx: KoaContext, error: any): Promise<void> {
    if (error?.name === 'UnauthorizedError') {
      ctx.status = HttpStatus.StatusCodes.UNAUTHORIZED;
      const errorMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Common_Client_Unauthorized_Error });
      ctx.body = {
        errorMessage,
      };
    } else if (error instanceof ClientValidationError) {
      const errorMessage = this.i18n.formatMessage({ id: error.errorMessage }, error.errorMessageValues ?? {});
      ctx.status = HttpStatus.StatusCodes.BAD_REQUEST;
      ctx.body = {
        errorMessage,
      };
    } else if (error instanceof BusinessError) {
      const errorMessage = this.i18n.formatMessage({ id: error.errorMessage }, error.errorMessageValues ?? {});
      ctx.status = HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        errorMessage,
      };
    } else {
      this.logger.error(`Server Error: ${ctx.url} ${error} ${(error as Record<string, string>).stack}`);

      ctx.status = HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
      const errorMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Common_Server_Unknown_Error });
      ctx.body = {
        errorMessage,
      };
    }
  }
}
