import React from "react";

interface ProtectedLayoutProps {
   children: React.ReactNode;
};

const _ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
   return (
      <div className="w-full h-full ">
         {children}
      </div>
   );
}

export default _ProtectedLayout;