import { Tag } from "@augejs/core";

export const ServiceModuleTag = (moduleCode?: string): ClassDecorator => {
  return function (target: Function) {
    Tag.defineMetadata(target, moduleCode ?? target.name);
  }
}

export function isServiceModuleTag(target: object, moduleCode?: string): boolean {
  const provider: Object = target.constructor;
  return Tag.hasMetadata(provider) && Tag.getMetadata(provider).includes(moduleCode ?? target.constructor.name);
}
