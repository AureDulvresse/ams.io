import { routes } from "@/routes/router";
import NavLink from "@/components/common/NavLink";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/img/logo_light.png";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 left-0 w-60 h-screen bg-white dark:bg-gray-900 shadow-lg z-50 transition-all transform translate-x-0`}
    >
      <div className="flex items-center gap-4 border-b p-4 relative">
        <Image src={logo} className="w-20 h-auto" alt="logo AMS" />
        <h1 className="text-base font-bold text-indigo-500 font-fredoka">Academia Management Sync</h1>
      </div>

      {/* Ajout de la classe scrollbar-custom */}
      <div className="mt-3 mr-1 px-2 h-[calc(100vh-120px)] overflow-y-auto scrollbar-custom">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            name={route.name}
            icon={route.icon}
            link={route.path}
            isActive={pathname === route.path}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
