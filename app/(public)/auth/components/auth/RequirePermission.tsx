'use client';

import { hasPermission } from "@/src/data/permission";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface RequirePermissionProps {
   permission: string[];
   code: string;
   children: ReactNode;
   fallback?: ReactNode;
}

export function RequirePermission({
   permission,
   code,
   children,
   fallback = null
}: RequirePermissionProps) {
   const { data: session } = useSession();
   const userRole = session?.user?.role;

   if (!userRole || !hasPermission(code, permission)) {
      return fallback;
   }

   return <>{children}</>;
}