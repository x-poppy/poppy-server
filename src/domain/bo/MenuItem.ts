import { ResourceEntity } from '../model/ResourceEntity';

export class MenuItem {
  resource: ResourceEntity;
  children: MenuItem[];

  constructor(resource: ResourceEntity) {
    this.resource = resource;
    this.children = [];
  }
}
