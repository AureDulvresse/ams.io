import React from "react";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarHeader,
   SidebarMenuSkeleton,
} from "../ui/sidebar";

// Composant utilitaire pour les skeletons
const SkeletonBox = ({ className }: { className?: string }) => (
   <SidebarMenuSkeleton
      className={`aspect-video rounded-xl ${className}`}
      aria-hidden="true"
      role="presentation"
   />
);

const AppSidebarSkeleton = () => {
   return (
      <Sidebar>
         {/* Header Skeleton */}
         <SidebarHeader>
            <SkeletonBox />
         </SidebarHeader>

         {/* Content Skeleton */}
         <SidebarContent>
            {/* Groupe 1 */}
            <SidebarGroup className="flex flex-col gap-1">
               <SkeletonBox />
               <SkeletonBox />
               <SkeletonBox />
            </SidebarGroup>

            {/* Groupe 2 */}
            <SidebarGroup className="flex flex-col gap-1">
               <SkeletonBox />
               <SkeletonBox />
               <SkeletonBox />
            </SidebarGroup>

            {/* Groupe 3 */}
            <SidebarGroup className="flex flex-col gap-1">
               <SkeletonBox />
               <SkeletonBox />
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
};

export default AppSidebarSkeleton;
