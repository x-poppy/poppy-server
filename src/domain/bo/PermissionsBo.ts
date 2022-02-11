import { MenuDO } from '../model/MenuDO';
import { RolePermissionDO } from '../model/RolePermissionDO';

export class PermissionBo {
  constructor(public appId: string, public name: string) {}
}

export class PermissionsBO {
  static fromJSON(json: Record<string, Record<string, boolean>> | null): PermissionsBO {
    const permissions = new PermissionsBO();
    if (json) {
      for (const [appId, perms] of Object.entries(json)) {
        for (const [name] of Object.entries(perms)) {
          const permission = new PermissionBo(appId, name);
          permissions.set(permission);
        }
      }
    }

    return permissions;
  }

  static fromMenu(menus?: MenuDO[] | null): PermissionsBO {
    const permissions = new PermissionsBO();
    if (menus) {
      for (const menu of menus) {
        const permission = new PermissionBo(menu.appId, menu.menuCode);
        permissions.set(permission);
      }
    }
    return permissions;
  }

  static fromRolePermissions(rolePermissions: RolePermissionDO[]): PermissionsBO {
    const permissions = new PermissionsBO();
    for (const rolePermission of rolePermissions) {
      const permission = new PermissionBo(rolePermission.appId, rolePermission.menuCode);
      permissions.set(permission);
      // if (parentPermissions.has(rolePermission.appId, rolePermission.menuCode)) {
      //   const permission = new PermissionBo(rolePermission.appId, rolePermission.menuCode);
      //   permissions.set(permission);
      // }
    }
    return permissions;
  }

  private appsPermsMap: Map<string, Map<string, PermissionBo>> | null = null;

  has(appId:string, name: string): boolean {
    if (!this.appsPermsMap) return false;

    const appPermsMap = this.appsPermsMap.get(appId);
    if (!appPermsMap) return false;

    return appPermsMap.has(name);
  }

  set(permission: PermissionBo): void {
    if (!this.appsPermsMap) {
      this.appsPermsMap = new Map();
    }

    let appPermsMap = this.appsPermsMap.get(permission.appId);
    if (!appPermsMap) {
      appPermsMap = new Map();
      this.appsPermsMap.set(permission.appId, appPermsMap);
    }

    appPermsMap.set(permission.name, permission);
  }

  delete(appId:string, name: string): boolean {
    // return this.permsMap.delete(name);
    if (!this.appsPermsMap) return false;

    const appPermsMap = this.appsPermsMap.get(appId);
    if (!appPermsMap) return false;

    const result = appPermsMap.delete(name);

    if (appPermsMap.size === 0) {
      this.appsPermsMap.delete(appId);
    }

    return result;
  }

  merge(permissions: PermissionsBO | null): this {
    if (!permissions) return this;
    if (!permissions.appsPermsMap) return this;
    if (permissions.appsPermsMap.size === 0) return this;

    const selfJson = this.toJSON();
    const targetJson = permissions.toJSON();

    for (const [appId, targetPerms] of Object.entries(targetJson)) {
      const selfPerms = selfJson[appId];
      selfJson[appId] = {
        ...selfPerms,
        ...targetPerms,
      }
    }

    this.fromJSON(selfJson);
    return this;
  }

  filter(permissions: PermissionsBO | null): this {
    if (!permissions) return this;
    if (!permissions.appsPermsMap) return this;
    if (permissions.appsPermsMap.size === 0) return this;

    const selfJson = this.toJSON();
    const resultJson: Record<string, Record<string, boolean>> = {};

    for (const [appId, targetPerms] of Object.entries(selfJson)) {
      Object.keys(targetPerms).forEach(name => {
        if (permissions.has(appId, name)) {
          let perms = resultJson[appId];
          if (!perms) {
            perms = {};
            resultJson[appId] = perms;
          }
          perms[name] = true;
        }
      })
    }

    this.fromJSON(resultJson);
    return this;
  }

  filterMenus(menus: MenuDO[] | null | undefined): MenuDO[] {
    if (!menus) return [];

    return menus.filter((menu) => {
      return this.has(menu.appId, menu.menuCode);
    });
  }

  fromJSON(json: Record<string, Record<string, boolean>> | null): void {
    if (this.appsPermsMap) {
      this.appsPermsMap.clear();
    }
    if (json) {
      for (const [appId, perms] of Object.entries(json)) {
        for (const [name] of Object.entries(perms)) {
          const permission = new PermissionBo(appId, name);
          this.set(permission);
        }
      }
    }
  }

  toJSON(): Record<string, Record<string, boolean>> {
    const results: Record<string, Record<string, boolean>> = {};
    if (this.appsPermsMap) {
      for (const [appId, appsPermMap] of this.appsPermsMap) {
        const perms: Record<string, boolean> = {};
        results[appId] = perms;
        for (const [name] of appsPermMap) {
          perms[name] = true;
        }
      }
    }
    return results;
  }
}
