'use client'
import React, { Suspense } from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb'
import { Separator } from '@radix-ui/react-separator'
import BreadcrumbSkeleton from '../skeletons/breadcrumb-skeleton'
import { Skeleton } from '../ui/skeleton'
import { NavUser } from './nav-user'

const Navbar = () => {
   return (
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
         <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Suspense fallback={<BreadcrumbSkeleton />}>
               <Breadcrumb>
                  <BreadcrumbList>
                     <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                           Building Your Application
                        </BreadcrumbLink>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator className="hidden md:block" />
                     <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                     </BreadcrumbItem>
                  </BreadcrumbList>
               </Breadcrumb>
            </Suspense>
         </div>
         <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
            <NavUser />
         </Suspense>
      </header>
   )
}

export default Navbar
