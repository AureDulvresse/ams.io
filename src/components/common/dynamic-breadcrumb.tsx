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

export interface BreadcrumbProps {
  breadcrumbItems: BreadcrumbItemProps[];
}

const DynamicBreadcrumb = ({ breadcrumbItems }: BreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((breadcrumbItems, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            {breadcrumbItems.isDropdown ? (
              <BreadcrumbItem className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbItems.dropdownItems?.map((dropdownItem, idx) => (
                      <DropdownMenuItem key={idx} ref={dropdownItem.href} className="font-inter">
                        {dropdownItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                {breadcrumbItems.isCurrent ? (
                  <BreadcrumbPage className="text-indigo-500 font-inter">{breadcrumbItems.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={breadcrumbItems.href} className="font-inter">{breadcrumbItems.label}</BreadcrumbLink>
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