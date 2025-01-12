import { User } from "next-auth";
import { Role } from "@/src/types/role";
import { Permission } from "./permission";

export type MyPageProps = {
  user:
    | (User & {
        id: string;
        first_name: string;
        last_name: string;
        role: Role;
        is_active: boolean;
        emailVerified?: Date;
        last_login?: Date;
      })
    | undefined;
  userPermissions: string[] | null;
  isLoading?: boolean;
  error?: Error | null;
  listItem?: T[] | any;
};

export type MySectionProps = {
  id: string;
  component: React.ReactNode;
  permission: string;
  roleNames: string[];
};

export interface RoleManagementPageProps extends MyPageProps {
  listPermissions: Permission[] | null;
  listRoles: Role[] | null;
}
