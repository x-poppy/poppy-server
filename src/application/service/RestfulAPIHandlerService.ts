import { BusinessError, ClientValidationError, NotFoundError } from '@/util/BusinessError';
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
    this.logger.info(ctx.method + ' ' + ctx.url);
  }

  async handlerError(ctx: KoaContext, err: unknown): Promise<void> {
    if (err instanceof ClientValidationError) {
      const errorMessage = this.i18n.formatMessage({ id: err.errorMessage }, err.errorMessageValues ?? {});
      ctx.status = HttpStatus.StatusCodes.BAD_REQUEST;
      ctx.body = {
        errorMessage,
      };
    } else if (err instanceof BusinessError) {
      const errorMessage = this.i18n.formatMessage({ id: err.errorMessage }, err.errorMessageValues ?? {});
      ctx.status = HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        errorMessage,
      };
    } else if (err instanceof Error) {
      const errorMessage = err.message ?? this.i18n.formatMessage({ id: I18nMessageKeys.Common_Server_Unknown_Error });
      ctx.status = (err as unknown as Record<string, number>).status ?? HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        errorMessage,
      };
      if ('status' in err) {
        // consider as the BusinessError
        this.logger.error(`Server Error: ${ctx.url} ${err}`);
      } else {
        this.logger.error(`Server Error: ${ctx.url} ${err} ${err.stack}`);
      }
    }
  }
}
