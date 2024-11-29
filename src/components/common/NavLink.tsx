import Link from "next/link";
import React from "react";

interface NavLinkProps {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  name,
  icon: Icon,
  link,
  isActive,
}) => {
  return (
    <Link
      href={link}
      className={`mb-1.5 rounded-lg px-1 py-2.5 flex items-center gap-3 transition-colors font-inter ${
        isActive
          ? "bg-indigo-200 dark:bg-indigo-500 text-indigo-600 dark:text-indigo-100 shadow-sm"
          : "hover:bg-indigo-50 dark:hover:bg-indigo-400"
      }`}
    >
      <div
        className={`shadow-lg rounded-lg p-1.5 ${
          isActive
            ? "bg-gradient-to-tr from-indigo-500 to-indigo-600"
            : "bg-gradient-to-tr from-indigo-400 to-indigo-500"
        }`}
      >
        <Icon className="text-white" fontSizeAdjust={2} fontSize={"4px"} />
      </div>
        <span
          className={`font-semibold text-sm ${
            isActive
              ? "text-indigo-600 dark:text-indigo-50"
              : "text-gray-700 dark:text-white"
          }`}
        >
          {name}
        </span>
    </Link>
  );
};

export default NavLink;
