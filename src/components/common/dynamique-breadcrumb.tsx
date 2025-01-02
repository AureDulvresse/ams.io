import React from "react";
import {
   Breadcrumb,
   BreadcrumbEllipsis,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface BreadcrumbItemProps {
   href?: string;
   label: string;
   isCurrent?: boolean;
   isDropdown?: boolean;
   dropdownItems?: { label: string; href?: string }[];
}

interface BreadcrumbProps {
   items: BreadcrumbItemProps[];
}

const DynamicBreadcrumb = ({ items }: BreadcrumbProps) => {
   return (
      <Breadcrumb className="bg-white dark:bg-gray-900 rounded py-3 px-2 shadow-sm">
         <BreadcrumbList>
            {items.map((item, index) => (
               <React.Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                  {item.isDropdown ? (
                     <BreadcrumbItem className="hidden md:block">
                        <DropdownMenu>
                           <DropdownMenuTrigger className="flex items-center gap-1">
                              <BreadcrumbEllipsis className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="start">
                              {item.dropdownItems?.map((dropdownItem, idx) => (
                                 <DropdownMenuItem key={idx} ref={dropdownItem.href} className="font-inter">
                                    {dropdownItem.label}
                                 </DropdownMenuItem>
                              ))}
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </BreadcrumbItem>
                  ) : (
                     <BreadcrumbItem>
                        {item.isCurrent ? (
                           <BreadcrumbPage className="text-indigo-500 font-bold font-inter">{item.label}</BreadcrumbPage>
                        ) : (
                           <BreadcrumbLink href={item.href} className="font-inter">{item.label}</BreadcrumbLink>
                        )}
                     </BreadcrumbItem>
                  )}
               </React.Fragment>
            ))}
         </BreadcrumbList>
      </Breadcrumb>
   );
}

export default DynamicBreadcrumb;