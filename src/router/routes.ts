import {
  GraduationCap,
  LayoutDashboard,
  UsersRound,
  Settings,
  Settings2,
  Send,
  DollarSign,
  CreditCard,
  TrendingUp,
  FileText,
  BarChart2,
} from "lucide-react";

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
  navFinance: [
    {
      title: "Finances",
      url: "#",
      icon: DollarSign,
      isActive: false,
      items: [
        {
          title: "Facturation et Paiements",
          url: "#",
          icon: CreditCard,
        },
        {
          title: "Gestion des Dépenses",
          url: "#",
          icon: FileText,
        },
        {
          title: "Suivi des Recettes",
          url: "#",
          icon: TrendingUp,
        },
        {
          title: "Rapports Financiers",
          url: "#",
          icon: BarChart2,
        },
        {
          title: "Paramétrage",
          url: "#",
          items: [
            {
              title: "Modes de Paiement",
              url: "#",
            },
            {
              title: "Tarification",
              url: "#",
            },
            {
              title: "Pénalités",
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
