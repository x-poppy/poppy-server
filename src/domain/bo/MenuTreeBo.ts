import { MenuEntity } from '../model/MenuEntity';

export class MenuTreeBo {
  node: MenuEntity;
  children: MenuTreeBo[] | null;

  constructor(node: MenuEntity) {
    this.node = node;
    this.children = null;
  }

  addChild(child: MenuTreeBo): void {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
  }
}
