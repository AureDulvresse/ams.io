import { ComponentType } from "react";
import {
  Home as HomeIcon,
  GraduationCap as GraduationCapIcon,
  SwatchBook as SwatchBookIcon,
  HandCoins as HandCCoinsIcon,
  ArrowBigUpDash as ArrowBigUpDashIcon,
  Users2 as UsersIcon,
  Calendar as CalendarIcon,
  Smile as SmileIcon,
  Landmark as LandmarkIcon,
  Settings as SettingsIcon,
  NotebookPenIcon,
} from "lucide-react";

export interface SidebarRoute {
  path: string;
  name: string;
  icon: ComponentType; // Utilisez ComponentType pour les icônes
}

export const routes: SidebarRoute[] = [
  { path: "/", name: "Accueil", icon: HomeIcon },
  { path: "/students", name: "Gestion étudiant", icon: GraduationCapIcon },
  { path: "/level-study", name: "Niveaud'étude", icon: ArrowBigUpDashIcon },
  { path: "/courses", name: "Gestion cours", icon: SwatchBookIcon },
  { path: "/schedules", name: "Emploi du temps", icon: CalendarIcon },
  { path: "/grades", name: "Administration des notes", icon: NotebookPenIcon },
  { path: "/hr", name: "Ressources Humaine", icon: UsersIcon },
  { path: "/finance", name: "Finance", icon: HandCCoinsIcon },
  { path: "/events", name: "Evenement", icon: SmileIcon },
  { path: "/patrimoine", name: "Patrimoine", icon: LandmarkIcon },
  { path: "/configuration", name: "Configuration", icon: SettingsIcon },
];
