import { SwaggerDefinition } from '@augejs/koa-swagger';
import { MenuDO } from '../model/MenuDO';

@SwaggerDefinition({
  properties: {
    node: { $ref: '#/definitions/MenuDO' },
    children: { type: 'array', items: { type: 'object', default: {} }},
  },
})
export class MenuTreeBO {

  static create(menu: MenuDO | null, allMenus: MenuDO[]): MenuTreeBO {
    const menuTree = new MenuTreeBO(menu);
    allMenus
      .filter((childrenMenu) => {
        if (!menu) {
          return childrenMenu.parent === '0'
        }

        return childrenMenu.parent === menu.id;
      })
      .forEach((childrenMenu) => {
        const childMenuTree = this.create(childrenMenu, allMenus);
        menuTree.addChild(childMenuTree);
      })
    return menuTree;
  }

  node: MenuDO | null;
  children: MenuTreeBO[];

  constructor(node: MenuDO | null) {
    this.node = node;
    this.children = [];
  }

  addChild(child: MenuTreeBO): void {
    this.children.push(child);
  }
}
