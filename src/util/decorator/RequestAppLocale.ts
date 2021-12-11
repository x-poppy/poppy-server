/* eslint-disable @typescript-eslint/no-explicit-any */
import { KoaContext, RequestParams } from "@augejs/koa";
import languageParser from 'accept-language-parser';

export function getAppLocalFromRequest(ctx: KoaContext): string {
  let appLocale = (ctx.request as any).appLocale;
  if (!appLocale) {
    appLocale = ctx.get('app-locale');
    if (!appLocale) {
      const acceptLanguage = ctx.get('accept-language');
      if (acceptLanguage) {
        const lang = languageParser.parse(acceptLanguage).find((lang) => lang.code && lang.region);
        if (lang) {
          appLocale = `${lang.code}-${lang.region}`;
        }
      }
    }
    if (!appLocale) {
      appLocale = 'en-US';
    }
    (ctx.request as any).appLocale = appLocale;
  }
  return appLocale;
}


export function RequestAppLocale(): ParameterDecorator {
  return RequestParams((ctx: KoaContext): string => {
    return getAppLocalFromRequest(ctx);
  })
}


