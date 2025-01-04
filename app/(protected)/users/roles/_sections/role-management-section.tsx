import { MySectionProps } from "@/src/types/custom-props";
import RoleSection from "../_components/role-section";

const roleManagementSections: MySectionProps[] = [
   {
      id: 'role',
      component: <RoleSection />,
      permission: 'ROLE_SHOW',
      roleNames: ['admin', 'superuser']
   }
];

export default roleManagementSections;