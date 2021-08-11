export class PermissionBo {
  constructor(public name: string) {}
}

export class PermissionsBo {
  static fromJSON(json: Record<string, boolean> | null): PermissionsBo {
    const permissions = new PermissionsBo();
    if (json) {
      for (const [name] of Object.entries(json)) {
        const permission = new PermissionBo(name);
        permissions.set(permission);
      }
    }

    return permissions;
  }

  private permsMap: Map<string, PermissionBo> | null = null;

  has(name: string): boolean {
    if (!this.permsMap) return false;

    return !!this.permsMap.has(name);
  }

  set(permission: PermissionBo): void {
    if (!this.permsMap) {
      this.permsMap = new Map();
    }
    this.permsMap.set(permission.name, permission);
  }

  delete(name: string): boolean {
    if (!this.permsMap) return false;
    return this.permsMap.delete(name);
  }

  merge(permissions: PermissionsBo): this {
    if (!permissions.permsMap) return this;

    if (!this.permsMap) {
      this.permsMap = new Map(permissions.permsMap);
      return this;
    }
    this.permsMap = new Map([...this.permsMap, ...permissions.permsMap]);
    return this;
  }

  toJson(): Record<string, PermissionBo> {
    const results: Record<string, PermissionBo> = {};
    if (this.permsMap) {
      for (const [key, value] of this.permsMap) {
        results[key] = value;
      }
    }

    return results;
  }
}
