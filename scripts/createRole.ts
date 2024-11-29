const createRole = async () => {
    const roles = [
        {
            name: "Super Admin",
            description: "Super administrateur"
        },
        {
            name: "Admin",
            description: "Administrateur rôle"
        },
        {
            name: "Teacher",
            description: "Membre du corps enseignant"
        },
        {
            name: "Gestionnaire",
            description: "Gestionnaire ou secrétaire de l'école"
        },
        {
            name: "Student",
            description: "Etudiant(e)"
        },
        {
            name: "Parent",
            description: "Parent d'élève"
        },
    ]

    roles.forEach(async (role) => {
        try {
            const response = await fetch("http://localhost:3000/api/roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(role),
            });

            if (response.ok) {
                const createdRole = await response.json();
                console.log("Rôle created:", createdRole);
            } else {
                const error = await response.json();
                console.error("Failed to create Rôle:", error);
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });
    
}