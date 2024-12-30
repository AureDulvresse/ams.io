const BreadcrumbSkeleton = () => {
   return (
      <div className="flex items-center gap-2">
         <div className="hidden md:block h-4 w-32 bg-gray-300 animate-pulse rounded"></div>
         <div className="hidden md:block h-4 w-4 bg-gray-300 animate-pulse rounded"></div>
         <div className="h-4 w-24 bg-gray-300 animate-pulse rounded"></div>
      </div>
   )
}

export default BreadcrumbSkeleton
