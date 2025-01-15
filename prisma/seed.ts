import { db } from "@/src/lib/prisma";
import { hashPassword } from "../src/lib/hasher";
import { UserStatus } from "@prisma/client";

async function main() {
  // Seed roles
  const roles = await db.role.createMany({
    data: [
      {
        name: "Super Admin",
        description: "Utilisateur avec un accès complet au système",
      },
      {
        name: "Admin",
        description: "Utilisateur avec des privilèges administratifs",
      },
      {
        name: "Directeur",
        description: "Directeur avec des privilèges administratifs",
      },
      {
        name: "Manager",
        description: "Gestionnaire avec des privilèges administratifs",
      },
      {
        name: "HR Manager",
        description:
          "Gestionnaire des ressources humaines avec des privilèges administratifs",
      },
      {
        name: "Finance Manager",
        description:
          "Gestionnaire financier avec des privilèges administratifs",
      },
      {
        name: "Assistant",
        description: "Assistant avec des privilèges administratifs",
      },
      {
        name: "Staff",
        description: "Personnel avec des privilèges spécifiques",
      },
      {
        name: "Comptable",
        description: "Utilisateur avec des privilèges financiers",
      },
      {
        name: "Teacher",
        description: "Enseignant qui peut gérer les cours et les étudiants",
      },
      {
        name: "Library",
        description: "Utilisateur avec des privilèges de bibliothèques",
      },
      {
        name: "Student",
        description: "Étudiant qui peut accéder aux cours et aux notes",
      },
      {
        name: "Parent",
        description: "Utilisateur avec des privilèges parentaux",
      },
      {
        name: "Guardian",
        description: "Utilisateur avec des privilèges de tuteur",
      },
    ],
  });

  // Seed permissions
  await db.permission.createMany({
    data: [
      {
        name: "Accès au tableau de bord",
        code: "DASHBOARD_VIEW",
        description: "Permet d'accéder au tableau de bord principal",
      },
      {
        name: "Accès au tableau de bord admin",
        code: "DASHBOARD_ADMIN",
        description: "Permet d'accéder au tableau de bord administratif",
      },
      {
        name: "Accès au tableau de bord finance",
        code: "DASHBOARD_FINANCE",
        description: "Permet d'accéder au tableau de bord financier",
      },
      {
        name: "Accès au tableau de bord manager",
        code: "DASHBOARD_MANAGER",
        description: "Permet d'accéder au tableau de bord du gestionnaire",
      },
      {
        name: "Accès au tableau de bord étudiant",
        code: "DASHBOARD_STUDENT",
        description: "Permet d'accéder au tableau de bord étudiant",
      },
      {
        name: "Accès au tableau de bord enseignant",
        code: "DASHBOARD_TEACHER",
        description: "Permet d'accéder au tableau de bord enseignant",
      },
      {
        name: "Accès au tableau de bord parent",
        code: "DASHBOARD_PARENT",
        description: "Permet d'accéder au tableau de bord parent",
      },
      {
        name: "Accès au tableau de bord assistant",
        code: "DASHBOARD_ASSISTANT",
        description: "Permet d'accéder au tableau de bord assistant",
      },
      {
        name: "Accès au tableau de bord ressources humaines",
        code: "DASHBOARD_HR",
        description:
          "Permet d'accéder au tableau de bord des ressources humaines",
      },
      {
        name: "Accès au tableau de bord bibliothèque",
        code: "DASHBOARD_LIBRARY",
        description: "Permet d'accéder au tableau de bord de la bibliothèque",
      },
      {
        name: "Accès au paramètre système",
        code: "SYSTEM_ADMIN",
        description: "Permet d'accéder aux paramètres du système",
      },
      {
        name: "Créer des permissions",
        code: "PERMISSION_CREATE",
        description: "Permet de créer de nouvelles permissions",
      },
      {
        name: "Lecture des permissions",
        code: "PERMISSION_VIEW",
        description: "Permet de visualiser les permissions du système",
      },
      {
        name: "Mise à jour des permissions",
        code: "PERMISSION_UPDATE",
        description: "Permet de mettre à jour les permissions du système",
      },
      {
        name: "Suppression des permissions",
        code: "PERMISSION_DELETE",
        description: "Permet de supprimer les permissions du système",
      },
      {
        name: "Restaurer les permissions",
        code: "PERMISSION_RESTORE",
        description: "Permet de restaurer les permissions supprimées",
      },
      {
        name: "Créer des utilisateurs",
        code: "USER_CREATE",
        description: "Permet de crééer de nouveaux utilisateurs",
      },
      {
        name: "Mise à jour des utilisateurs",
        code: "USER_UPDATE",
        description: "Permet de mettre à jour les utilisateurs du système",
      },
      {
        name: "Suppression des utilisateurs",
        code: "USER_DELETE",
        description: "Permet de supprimer les utilisateurs du système",
      },
      {
        name: "Restaurer les utilisateurs",
        code: "USER_RESTORE",
        description: "Permet de restaurer les utilisateurs supprimés",
      },
      {
        name: "Lecture des utilisateurs",
        code: "USER_VIEW",
        description: "Permet de visualiser les utilisateurs du système",
      },
      {
        name: "Création de rôles",
        code: "ROLE_CREATE",
        description: "Permet de créer de nouveaux rôles",
      },
      {
        name: "Lecture des rôles",
        code: "ROLE_VIEW",
        description: "Permet de visualiser les rôles du système",
      },
      {
        name: "Mise à jour des rôles",
        code: "ROLE_UPDATE",
        description: "Permet de mettre à jour les rôles du système",
      },
      {
        name: "Suppression des rôles",
        code: "ROLE_DELETE",
        description: "Permet de supprimer les rôles du système",
      },
      {
        name: "Restaurer les rôles",
        code: "ROLE_RESTORE",
        description: "Permet de restaurer les rôles supprimés",
      },
      {
        name: "Créer des années academiques",
        code: "ACADEMIC_YEAR_CREATE",
        description: "Permet de créer de nouvelles années académiques",
      },
      {
        name: "Mise à jour des années académiques",
        code: "ACADEMIC_YEAR_UPDATE",
        description: "Permet de mettre à jour les années académiques",
      },
      {
        name: "Suppression des années académiques",
        code: "ACADEMIC_YEAR_DELETE",
        description: "Permet de supprimer les années académiques",
      },
      {
        name: "Restaurer les années académiques",
        code: "ACADEMIC_YEAR_RESTORE",
        description: "Permet de restaurer les années académiques supprimées",
      },
      {
        name: "Lecture des années académiques",
        code: "ACADEMIC_YEAR_VIEW",
        description: "Permet de visualiser les années académiques",
      },
      {
        name: "Créer des semestres",
        code: "SEMESTER_CREATE",
        description: "Permet de créer de nouveaux semestres",
      },
      {
        name: "Mise à jour des semestres",
        code: "SEMESTER_UPDATE",
        description: "Permet de mettre à jour les semestres",
      },
      {
        name: "Suppression des semestres",
        code: "SEMESTER_DELETE",
        description: "Permet de supprimer les semestres",
      },
      {
        name: "Restaurer les semestres",
        code: "SEMESTER_RESTORE",
        description: "Permet de restaurer les semestres supprimées",
      },
      {
        name: "Lecture des semestres",
        code: "SEMESTER_VIEW",
        description: "Permet de visualiser les semestres",
      },
      {
        name: "Créer des départements",
        code: "DEPARTMENT_CREATE",
        description: "Permet de créer de nouveaux départements",
      },
      {
        name: "Mise à jour des départements",
        code: "DEPARTMENT_UPDATE",
        description: "Permet de mettre à jour les départements",
      },
      {
        name: "Suppression des départements",
        code: "DEPARTMENT_DELETE",
        description: "Permet de supprimer les départements",
      },
      {
        name: "Restaurer les départements",
        code: "DEPARTMENT_RESTORE",
        description: "Permet de restaurer les départements supprimés",
      },
      {
        name: "Lecture des départements",
        code: "DEPARTMENT_VIEW",
        description: "Permet de visualiser les départements",
      },
      {
        name: "Créer des matières",
        code: "SUBJECT_CREATE",
        description: "Permet de créer de nouvelles matières",
      },
      {
        name: "Mise à jour des matières",
        code: "SUBJECT_UPDATE",
        description: "Permet de mettre à jour les matières",
      },
      {
        name: "Suppression des matières",
        code: "SUBJECT_DELETE",
        description: "Permet de supprimer les matières",
      },
      {
        name: "Restaurer les matières",
        code: "SUBJECT_RESTORE",
        description: "Permet de restaurer les matières supprimées",
      },
      {
        name: "Lecture des matières",
        code: "SUBJECT_VIEW",
        description: "Permet de visualiser les matières",
      },
      {
        name: "Créer des cours",
        code: "COURSE_CREATE",
        description: "Permet de créer de nouveaux cours",
      },
      {
        name: "Mise à jour des cours",
        code: "COURSE_UPDATE",
        description: "Permet de mettre à jour les cours",
      },
      {
        name: "Suppression des cours",
        code: "COURSE_DELETE",
        description: "Permet de supprimer les cours",
      },
      {
        name: "Restaurer les cours",
        code: "COURSE_RESTORE",
        description: "Permet de restaurer les cours supprimés",
      },
      {
        name: "Lecture des cours",
        code: "COURSE_VIEW",
        description: "Permet de visualiser les cours",
      },
      {
        name: "Créer des programmes",
        code: "PROGRAM_CREATE",
        description: "Permet de créer de nouveaux programmes",
      },
      {
        name: "Mise à jour des programmes",
        code: "PROGRAM_UPDATE",
        description: "Permet de mettre à jour les programmes",
      },
      {
        name: "Suppression des programmes",
        code: "PROGRAM_DELETE",
        description: "Permet de supprimer les programmes",
      },
      {
        name: "Restaurer les programmes",
        code: "PROGRAM_RESTORE",
        description: "Permet de restaurer les programmes supprimés",
      },
      {
        name: "Créer des nouveaux personnel",
        code: "STAFF_CREATE",
        description: "Permet de créer de nouveaux personnel",
      },
      {
        name: "Mise à jour des personnels",
        code: "STAFF_UPDATE",
        description: "Permet de mettre à jour les personnels",
      },
      {
        name: "Suppression des personnels",
        code: "STAFF_DELETE",
        description: "Permet de supprimer les personnels",
      },
      {
        name: "Restaurer les personnels",
        code: "STAFF_RESTORE",
        description: "Permet de restaurer les personnels supprimés",
      },
      {
        name: "Lecture des personnels",
        code: "STAFF_VIEW",
        description: "Permet de visualiser les personnels",
      },
      {
        name: "Demander un congé",
        code: "LEAVE_REQUEST",
        description: "Permet de demander un congé",
      },
      {
        name: "Valider un congé",
        code: "LEAVE_APPROVE",
        description: "Permet de valider un congé",
      },
      {
        name: "Refuser un congé",
        code: "LEAVE_REJECT",
        description: "Permet de refuser un congé",
      },
      {
        name: "Voir la liste des congés",
        code: "LEAVE_LIST",
        description: "Permet de voir la liste des congés",
      },
      {
        name: "Créer des présences personnel",
        code: "ATTENDANCE_STAFF_CREATE",
        description:
          "Permet de créer des enregistrements de présence pour le personnel.",
      },
      {
        name: "Modifier des présences personnel",
        code: "ATTENDANCE_STAFF_UPDATE",
        description:
          "Permet de modifier des enregistrements de présence pour le personnel.",
      },
      {
        name: "Supprimer des présences personnel",
        code: "ATTENDANCE_STAFF_DELETE",
        description:
          "Permet de supprimer des enregistrements de présence pour le personnel.",
      },
      {
        name: "Visualiser les présences personnel",
        code: "ATTENDANCE_STAFF_VIEW",
        description:
          "Permet de visualiser les enregistrements de présence pour le personnel.",
      },
      {
        name: "Générer des rapports de présence personnel",
        code: "ATTENDANCE_STAFF_REPORT",
        description:
          "Permet de générer des rapports de présence pour le personnel.",
      },
      {
        name: "Créer des présences étudiants",
        code: "ATTENDANCE_STUDENT_CREATE",
        description:
          "Permet de créer des enregistrements de présence pour les étudiants.",
      },
      {
        name: "Modifier des présences étudiants",
        code: "ATTENDANCE_STUDENT_UPDATE",
        description:
          "Permet de modifier des enregistrements de présence pour les étudiants.",
      },
      {
        name: "Supprimer des présences étudiants",
        code: "ATTENDANCE_STUDENT_DELETE",
        description:
          "Permet de supprimer des enregistrements de présence pour les étudiants.",
      },
      {
        name: "Visualiser les présencess étudiants",
        code: "ATTENDANCE_STUDENT_VIEW",
        description:
          "Permet de visualiser les enregistrements de présence pour les étudiants.",
      },
      {
        name: "Générer des rapports de présencs étudiantsl",
        code: "ATTENDANCE_STUDENT_REPORT",
        description:
          "Permet de générer des rapports de présence pour les étudiants.",
      },
      {
        name: "Créer un étudiant",
        code: "STUDENT_CREATE",
        description: "Permet de créer de nouveaux étudiants",
      },
      {
        name: "Mise à jour des étudiants",
        code: "STUDENT_UPDATE",
        description: "Permet de mettre à jour les étudiants",
      },
      {
        name: "Suppression des étudiants",
        code: "STUDENT_DELETE",
        description: "Permet de supprimer les étudiants",
      },
      {
        name: "Restaurer les étudiants",
        code: "STUDENT_RESTORE",
        description: "Permet de restaurer les étudiants supprimés",
      },
      {
        name: "Lecture des étudiants",
        code: "STUDENT_VIEW",
        description: "Permet de visualiser les étudiants",
      },
      {
        name: "Créer des notes",
        code: "GRADE_CREATE",
        description: "Permet de créer de nouvelles notes",
      },
      {
        name: "Mise à jour des notes",
        code: "GRADE_UPDATE",
        description: "Permet de mettre à jour les notes",
      },
      {
        name: "Suppression des notes",
        code: "GRADE_DELETE",
        description: "Permet de supprimer les notes",
      },
      {
        name: "Restaurer les notes",
        code: "GRADE_RESTORE",
        description: "Permet de restaurer les notes supprimées",
      },
      {
        name: "Lecture des notes",
        code: "GRADE_VIEW",
        description: "Permet de visualiser les notes",
      },
      {
        name: "Gestion des notifications",
        code: "NOTIFICATION_MANAGE",
        description: "Permet de gérer les notifications du système",
      },
      {
        name: "Gestion des paramètres",
        code: "SETTING_MANAGE",
        description: "Permet de gérer les paramètres du système",
      },
      {
        name: "Gestion des rapports",
        code: "REPORT_MANAGE",
        description: "Permet de gérer les rapports du système",
      },
      {
        name: "Lecture des rapports",
        code: "REPORT_VIEW",
        description: "Permet de visualiser les rapports du système",
      },
    ],
  });

  // Assign permissions to roles
  const superAdminRole = await db.role.findFirst({
    where: { name: "Super Admin" },
  });

  // Assign permissions to Super Admin
  const allPermissions = await db.permission.findMany();

  // Batch permission assignments
  const batchSize = 50;
  for (let i = 0; i < allPermissions.length; i += batchSize) {
    const batch = allPermissions.slice(i, i + batchSize);
    await db.rolePermission.createMany({
      data: batch.map((permission: { id: any; }) => ({
        roleId: superAdminRole?.id || 1,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }

  const admin_password = await hashPassword("SuperAdmin123!");
  const other_user_password = await hashPassword("User123!")

  // Then create users
  const users = await Promise.all([
    // Super Admin
    db.user.upsert({
      where: { email: "adentrepreneur02@gmail.com" },
      update: {},
      create: {
        email: "adentrepreneur02@gmail.com",
        password: admin_password,
        first_name: "Super",
        last_name: "Admin",
        roleId: superAdminRole?.id || 1,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      },
    }),

    // Admin
    db.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        password: other_user_password,
        first_name: "Jean",
        last_name: "Dupont",
        roleId: 2,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      },
    }),

    // Regular User 1
    db.user.upsert({
      where: { email: "marie.martin@example.com" },
      update: {},
      create: {
        email: "marie.martin@example.com",
        password: other_user_password,
        first_name: "Marie",
        last_name: "Martin",
        roleId: 3,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      },
    }),

    // Regular User 2
    db.user.upsert({
      where: { email: "pierre.dubois@example.com" },
      update: {},
      create: {
        email: "pierre.dubois@example.com",
        password: other_user_password,
        first_name: "Pierre",
        last_name: "Dubois",
        roleId: 4,
        status: UserStatus.ACTIVE,
      },
    }),

    db.user.upsert({
      where: { email: "dominique.makaya@example.com" },
      update: {},
      create: {
        email: "dominique.makaya@example.com",
        password: other_user_password,
        first_name: "Dominique",
        last_name: "MAKAYA",
        roleId: 4,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      },
    }),

    db.user.upsert({
      where: { email: "alexandra.li@example.com" },
      update: {},
      create: {
        email: "alexandra.li@example.com",
        password: other_user_password,
        first_name: "Alexandra",
        last_name: "LI",
        roleId: 5,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      },
    }),

    db.user.upsert({
      where: { email: "dieuviel.mavoungou@example.com" },
      update: {},
      create: {
        email: "dieuviel.mavoungou@example.com",
        password: other_user_password,
        first_name: "Dieuviel",
        last_name: "MAVOUNGOU",
        roleId: 6,
        status: UserStatus.ACTIVE,
        emailVerified: new Date(),
      },
    }),

    // Inactive User
    db.user.upsert({
      where: { email: "sophie.moreau@example.com" },
      update: {},
      create: {
        email: "sophie.moreau@example.com",
        password: other_user_password,
        first_name: "Sophie",
        last_name: "Moreau",
        roleId: 5,
        status: UserStatus.INACTIVE,
      },
    }),
  ]);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
