import { Tag } from "@augejs/core";

export const ServiceModuleTag = (moduleCode: string): ClassDecorator => {
  return Tag(moduleCode);
}

export function isServiceModuleTag(target: Object, moduleCode: string): boolean {
  const provider: Object = target.constructor;
  return Tag.hasMetadata(provider) && Tag.getMetadata(provider).includes(moduleCode);
}
