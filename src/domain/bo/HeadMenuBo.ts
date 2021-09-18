import { MenuEntity } from '../model/MenuEntity';

export class HeadMenuBo {
  node: MenuEntity;
  constructor(node: MenuEntity) {
    this.node = node;
  }
}
