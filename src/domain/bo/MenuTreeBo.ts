import { MenuEntity } from '../model/MenuEntity';

export class MenuTreeBo {

  static create(menu: MenuEntity | null, allMenus: MenuEntity[]): MenuTreeBo {
    const menuTree = new MenuTreeBo(menu);
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

  node: MenuEntity | null;
  children: MenuTreeBo[];

  constructor(node: MenuEntity | null) {
    this.node = node;
    this.children = [];
  }

  addChild(child: MenuTreeBo): void {
    this.children.push(child);
  }
}
