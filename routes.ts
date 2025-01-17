/**
 * Vérifie si un chemin correspond à une route ou ses sous-routes
 */
export const matchesRoute = (pathname: string, routes: string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

/**
 * Crée une URL de redirection avec un paramètre optionnel
 */
export const createRedirectUrl = (
  path: string,
  baseUrl: string,
  fromPath?: string
): URL => {
  const url = new URL(path, baseUrl);
  if (fromPath && !fromPath.startsWith(path)) {
    url.searchParams.set("from", fromPath);
  }
  return url;
};

// Configuration des routes
export const publicRoutes = ["/"];
export const authRoutes = ["/login", "/login?from=%2Fdashboard"];
export const privateRoutes = ["/dashboard", "/academic/departments", "academic/courses", "/users", "/users/roles"];
export const apiAuthPrefix = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "http://localhost:3000/dashboard";

// App Routes for AMS
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Calendar,
  UserCog,
  Wallet,
  Library,
  Building2,
  Settings,
  HelpCircle,
} from "lucide-react";

export const appRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
  navAcademy: [
    {
      title: "Gestion Académique",
      url: "/academic",
      icon: GraduationCap,
      items: [
        {
          title: "Départements",
          url: "/academic/departments",
        },
        {
          title: "Cours et Matières",
          url: "/academic/courses",
        },
        {
          title: "Emploi du temps",
          url: "/academic/schedule",
        },
        {
          title: "Résultats et Notes",
          url: "/academic/results",
        },
        {
          title: "Groupes et Classes",
          url: "/academic/classes",
        },
      ],
    },
  ],
  navHR: [
    {
      title: "Gestion du Personnel",
      url: "/staff",
      icon: Users,
      items: [
        {
          title: "Employés",
          url: "/staff/employees",
        },
        {
          title: "Tâches à Exécuter",
          url: "/staff/tasks",
        },
        {
          title: "Évaluations",
          url: "/staff/reviews",
        },
        {
          title: "Présences et Absences",
          url: "/staff/attendance",
        },
        {
          title: "Congés",
          url: "/staff/leaves",
        },
        {
          title: "Recrutement",
          url: "/staff/recruitment",
        },
      ],
    },
  ],
  navDrafting: [
    {
      title: "Planification",
      url: "/drafting",
      icon: Calendar,
      items: [
        {
          title: "Évènement",
          url: "/drafting/events",
        },
        {
          title: "Calendrier",
          url: "/drafting/calendar",
        },
        {
          title: "Mes tâches",
          url: "/drafting/to-do",
        },
      ],
    },
  ],
  navUser: [
    {
      title: "Utilisateurs",
      url: "/users",
      icon: UserCog,
      items: [
        {
          title: "Étudiants",
          url: "/users/students",
        },
        {
          title: "Enseignants",
          url: "/users/teachers",
        },
        {
          title: "Personnel Administratif",
          url: "/users/staff",
        },
        {
          title: "Bibliothécaires",
          url: "/users/librarians",
        },
        {
          title: "Rôles et Permissions",
          url: "/users/roles",
        },
      ],
    },
  ],
  navFinance: [
    {
      title: "Finances",
      url: "/finance",
      icon: Wallet,
      items: [
        {
          title: "Paiements",
          url: "/finance/payments",
        },
        {
          title: "Revenus",
          url: "/finance/revenues",
        },
        {
          title: "Dépenses",
          url: "/finance/expenses",
        },
        {
          title: "Facturation",
          url: "/finance/billing",
        },
      ],
    },
  ],
  navLibrary: [
    {
      title: "Bibliothèque",
      url: "/library",
      icon: Library,
      items: [
        {
          title: "Livres Disponibles",
          url: "/library/books",
        },
        {
          title: "Livres Empruntés",
          url: "/library/borrowed",
        },
        {
          title: "Demandes de Livres",
          url: "/library/requests",
        },
        {
          title: "Gestion des Livres",
          url: "/library/manage",
        },
      ],
    },
  ],
  navPatrimony: [
    {
      title: "Patrimoine",
      url: "/patrimony",
      icon: Building2,
      items: [
        {
          title: "Salle de classe",
          url: "/patrimony/classroom",
        },
        {
          title: "Inventaire de matériel",
          url: "/patrimony/inventory",
        },
      ],
    },
  ],
  navSettings: [
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Configuration Générale",
          url: "/settings/general",
        },
        {
          title: "Compte Utilisateur",
          url: "/settings/account",
        },
        {
          title: "Sécurité",
          url: "/settings/security",
        },
      ],
    },
    {
      title: "Support",
      url: "/support",
      icon: HelpCircle,
      items: [
        {
          title: "Documentation",
          url: "/support/docs",
        },
        {
          title: "Contactez-nous",
          url: "/support/contact",
        },
        {
          title: "FAQs",
          url: "/support/faqs",
        },
      ],
    },
  ],
};
