// Modèle Permission
export type Permission = {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
};

// Modèle RolePermission
export type RolePermission = {
  roleId: number;
  permissionId: number;
  permission: Permission;
};
