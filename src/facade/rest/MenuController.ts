import { MenuTreeBo } from '@/domain/bo/MenuTreeBo';
import { MenuService } from '@/domain/service/MenuService';
import { PPAccessData } from '@/types/PPAccessData';
import { RequestAccessData } from '@/util/decorator/RequestAccessData';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';

@SwaggerTag({ name: 'Menu', description: '`Menu` Entity.'})
@Prefix('/api/v1/menu')
@Provider()
export class MenuController {

  @Inject(MenuService)
  private service!: MenuService;

  @SwaggerAPI('/api/v1/menu/sidebar', 'get', {
    tags: [ 'Menu' ],
    summary: 'get',
    responses: {
      '200': {
        schema: {
          type: 'object',
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/sidebar')
  async sideBar(@RequestAccessData() accessData: PPAccessData): Promise<MenuTreeBo[]> {
    const menuTreeBo = await this.service.menuTreeBySideBar(accessData);
    return menuTreeBo.children;
  }

  @SwaggerAPI('/api/v1/menu/list', 'post', {
    tags: [ 'Menu' ],
    summary: 'list',
    responses: {
      '200': {
        schema: {
          type: 'object',
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/list')
  async list(@RequestAccessData() accessData: PPAccessData): Promise<MenuTreeBo> {
    return this.service.menuTreeByList(accessData);
  }

  @SwaggerAPI('/api/v1/menu/{id}', 'delete', {
    tags: [ 'Menu' ],
    summary: 'delete',
    parameters: [
      {
        in: 'path',
        name: 'id',
        type: 'string',
        required: true,
      },
    ],
    responses: {
      '200': {
        schema: {
          type: 'object'
        },
        description: ''
      }
    },
    security: [{
      accessToken: []
    }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('/:id')
  async delete(
    @RequestParams.Params('id') id: string
  ): Promise<{}> {
    await this.service.delete(id);
    return {};
  }
}
