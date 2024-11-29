const createSuperUser = async () => {
    const superAdmin = {
        email: "admin@ams.io",
        first_name: "Aure",
        last_name: "Dulvresse",
        password: "password",
        role_id: 1,
        related_at: 1,
    }

    try {
        const response = await fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(superAdmin),
        });

        if (response.ok) {
            const createdUser = await response.json();
            console.log("Super Admin created:", createdUser);
        } else {
            const error = await response.json();
            console.error("Failed to create Super Admin:", error);
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
};

createSuperUser();
