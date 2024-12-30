export interface FeaturesProps {
  name: string;
  shorcut: string;
}

const appFeatures: FeaturesProps[] = [
  {
    name: "Tableau de board",
    shorcut: "/",
  },
  {
    name: "Accueil",
    shorcut: "/",
  },
  {
    name: "Gestion étudiant",
    shorcut: "/students",
  },
  {
    name: "Enregistrer un étudiant",
    shorcut: "/students/create",
  },
  {
    name: "Inscrire un étudiant",
    shorcut: "/students/create",
  },
  {
    name: "Gestion des cours",
    shorcut: "/courses",
  },
  {
    name: "Gestion des departements",
    shorcut: "/department",
  },
  {
    name: "Ajout d'un departements",
    shorcut: "/department/create",
  },
  {
    name: "Messagerie",
    shorcut: "/chat",
  },
  {
    name: "Notifications",
    shorcut: "/notifications",
  },
  {
    name: "Emploi du temps",
    shorcut: "/schedules",
  },
  {
    name: "Gestion des départements",
    shorcut: "/department",
  },
  {
    name: "Enregistre un nouveau département",
    shorcut: "/department/create",
  },
  {
    name: "Gestion des cours",
    shorcut: "/courses",
  },
  {
    name: "Enregistre un nouveau cours",
    shorcut: "/courses/create",
  },
  {
    name: "Gestion des évènements",
    shorcut: "/events",
  },
  {
    name: "Enregistre un nouvel évènement",
    shorcut: "/events/create",
  },
  {
    name: "Ressource humaine",
    shorcut: "/hr",
  },
  {
    name: "Enregistrer un personnel",
    shorcut: "/hr/create",
  },
  {
    name: "Finance",
    shorcut: "/finance",
  },
  {
    name: "Configuration",
    shorcut: "/settings",
  },
  {
    name: "Settings",
    shorcut: "/settings",
  },
  {
    name: "Profil",
    shorcut: "/profile",
  },
  {
    name: "Performance academique",
    shorcut: "/grades",
  },
  {
    name: "Gestion des notes",
    shorcut: "/grades",
  },
];

export default appFeatures;
