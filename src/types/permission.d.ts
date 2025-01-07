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
  role_id: number;
  permission_id: number;
  permission: Permission;
};
