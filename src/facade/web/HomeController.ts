import path from 'path';
import { Provider, __appRootDir } from '@augejs/core';
import { KoaContext, RequestMapping, RequestParams } from '@augejs/koa';
import { SwaggerAPI, SwaggerConsumes, SwaggerInfo, SwaggerProduces, SwaggerSchemes, SwaggerSecurityDefinition, SwaggerTag } from '@augejs/koa-swagger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.join(__appRootDir, 'package.json'));

@SwaggerInfo({version: pkg.version, title: pkg.name, description: pkg.description})
@SwaggerTag({name: 'System',})
@SwaggerConsumes(['application/json','application/x-www-form-urlencoded'])
@SwaggerProduces(['application/json'])
@SwaggerSchemes(['http', 'https'])
@SwaggerSecurityDefinition('accessToken', {
  type: 'apiKey',
  name: 'Authorization',
  in: 'header'
})
@Provider()
export class HomeController {
  @RequestMapping.Get('/')
  async home(@RequestParams.Context() context: KoaContext): Promise<void> {
    context.type = 'html';
    await context.sendFile('./index.html', {
      root: path.join(__appRootDir, './node_modules/@x-poppy/poppy-web/build'),
      maxAge: 0,
    });
  }

  @SwaggerAPI('/LICENSE', 'get', {
    tags: [ 'System' ],
    summary: 'LICENSE',
    responses: {
      '200': {
        description: ''
      }
    }
  })
  @RequestMapping.Get('/LICENSE')
  async license(@RequestParams.Context() context: KoaContext): Promise<void> {
    context.type = 'text';
    await context.sendFile('./LICENSE', {
      root: __appRootDir,
    });
  }

  @SwaggerAPI('/health', 'get', {
    tags: [ 'System' ],
    summary: 'Get Server health info',
    responses: {
      '200': {
        description: ''
      }
    }
  })
  @RequestMapping.Get('/health')
  health(@RequestParams.Context() ctx: KoaContext): Record<string, unknown> {
    const request = ctx.request;
    return {
      pkgName: pkg.name,
      pkgVer: pkg.version,
      request: {
        method: request.method,
        url: request.url,
        search: request.search,
        query: request.querystring,
        href: request.href,
        origin: request.origin,
        originalUrl: request.originalUrl,
        path: request.path,
        host: request.host,
        hostname: request.hostname,
        fresh: request.fresh,
        stale: request.stale,
        idempotent: request.idempotent,
        secure: request.secure,
        ip: request.ip,
        ips: request.ips,
        subdomains: request.subdomains,
        headers: request.headers,
      }
    };
  }
}
