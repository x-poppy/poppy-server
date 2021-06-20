import { BusinessError } from '@/domain/exception/BusinessError';
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

  async handlerError(ctx: KoaContext, error: unknown): Promise<void> {
    this.logger.error(`Server Error: ${ctx.url} ${error} ${(error as Record<string, string>).stack}`);

    if (error instanceof BusinessError) {
      const errorMessage = this.i18n.formatMessage({ id: error.errorMessage }, error.errorMessageValues ?? {});
      ctx.status = HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        errorMessage,
      };
    } else {
      ctx.status = HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        errorMessage: 'Unknown Error!'
      };
    }
  }
}
