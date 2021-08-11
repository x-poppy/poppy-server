export class PermissionsBo {
  private permissions: Record<string, boolean>;

  constructor(permissions: Record<string, boolean>) {
    this.permissions = permissions;
  }

  hasPermission(name: string): boolean {
    return !!this.permissions[name];
  }
}
