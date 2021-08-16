import { ResourceEntity } from '../model/ResourceEntity';

export class HomeMenuTreeBo {
  node: ResourceEntity;
  children: HomeMenuTreeBo[] | null;

  constructor(node: ResourceEntity) {
    this.node = node;
    this.children = null;
  }

  addChild(child: HomeMenuTreeBo): void {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
  }
}
