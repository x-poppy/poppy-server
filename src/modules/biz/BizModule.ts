import { formatErrorMessage } from '@/utils/formatErrorMessage';
import { ILogger, IScanNode, Logger, Provider } from '@augejs/core';
import { KoaErrorHandleMiddleWare } from '@augejs/koa-error-handle';
import { KoaBodyParserMiddleware } from '@augejs/koa-bodyparser';

import { ErrorCodeEnum } from '@/errors/ErrorCodeEnum';
import { IKoaContext, Middleware, Validator } from '@augejs/koa';
import { I18N_IDENTIFIER, II18n } from '@augejs/i18n';

const { ValidationError } = Validator;

const logger: ILogger = Logger.getLogger('errorHandle');

@Provider()
@KoaBodyParserMiddleware()
@Middleware(async (ctx: IKoaContext, next: Function) => {
  await next();
  if (ctx.status == 200 && !!ctx.body) {
    ctx.body.respCode = 'S001';
    ctx.body.respMessage = 'SUCCESS';
  }
})
@KoaErrorHandleMiddleWare(() => {
  return {
    json: async (ctx: IKoaContext, err: any, scanNode: IScanNode) => {
      const i18n: II18n = scanNode.context.container.get<II18n>(I18N_IDENTIFIER);
      let respCode: string = ErrorCodeEnum.UNEXPECTED_EXCEPTION;
      let respMessage: string | null = null;
      if (Array.isArray(err) && err.length > 0 && err[0] instanceof ValidationError) {
        respCode = ErrorCodeEnum.INVALID_REQUEST;
        respMessage = err[0].toString();
      } else if (err instanceof Error) {
        respMessage = err.message;
        if ((err as any)?.errorCode) {
          respCode = (err as any)?.errorCode;
        }
      }
      if (!respMessage) {
        respMessage = formatErrorMessage(i18n, `ErrorMessage_${ErrorCodeEnum.UNEXPECTED_EXCEPTION}`);
      }

      ctx.status = 200;
      ctx.body = {
        respCode,
        respMessage,
      };

      logger.error(err);
      logger.error(err?.stack);
    },
  };
})
export class WebAPIModule {}
