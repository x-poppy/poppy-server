import { ResourceEntity } from '../model/ResourceEntity';

export class MenuTreeBo {
  node: ResourceEntity;
  children: MenuTreeBo[] | null;

  constructor(node: ResourceEntity) {
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
