import {
  GraduationCap,
  LayoutDashboard,
  LucideIcon,
  Send,
  Settings,
  Settings2,
  UsersRound,
} from "lucide-react";

export interface SidebarRoute {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

const app_routes = {
  navDashboard: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Administrateur",
          url: "#",
        },
        {
          title: "Directeur",
          url: "#",
        },
        {
          title: "Enseignant",
          url: "#",
        },
        {
          title: "Comptable",
          url: "#",
        },
      ],
    },
  ],
  navAcademic: [
    {
      title: "Academie",
      url: "#",
      icon: GraduationCap,
      isActive: false,
      items: [
        {
          title: "Gestion étudiant",
          url: "#",
        },
        {
          title: "Emplois du temps",
          url: "#",
        },
        {
          title: "Gestion des filières / départements d'étude",
          url: "#",
        },
        {
          title: "Gestion des cours",
          url: "#",
        },
        {
          title: "Administration des notes",
          url: "#",
        },
        {
          title: "Paramétrage",
          url: "#",
          icon: Settings,
          items: [
            {
              title: "Niveau d'étude",
              url: "#",
            },
            {
              title: "Explorer",
              url: "#",
            },
            {
              title: "Quantum",
              url: "#",
            },
          ],
        },
      ],
    },
  ],
  navHR: [
    {
      title: "Ressources humaines",
      url: "#",
      icon: UsersRound,
      items: [
        {
          title: "Gestion du personnel",
          url: "#",
        },
        {
          title: "Pointage & Présences",
          url: "#",
        },
        {
          title: "Gestion de la paie",
          url: "#",
        },
        {
          title: "Paramétrage",
          url: "#",
        },
      ],
    },
  ],
  navSettings: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export default app_routes;
