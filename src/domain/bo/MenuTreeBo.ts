import { ResourceEntity } from '../model/ResourceEntity';

export class MenuTreeBo {
  node: ResourceEntity;
  children: MenuTreeBo[];

  constructor(node: ResourceEntity) {
    this.node = node;
    this.children = [];
  }
}
