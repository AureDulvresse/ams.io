const createSubscriptionPlans = async () => {
    const plans = [
        {
            name: "Basic Plan",
            price: "30000",
            description: "Basic features for small schools",
        },
        {
            name: "Premium Plan",
            price: "50000",
            description: "All features",
        },
    ];

    plans.forEach(async (plan) => {
        try {
            const response = await fetch("http://localhost:3000/api/subscription-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(plan),
            });

            if (response.ok) {
                const createdPlan = await response.json();
                console.log("Plan created:", createdPlan);
            } else {
                const error = await response.json();
                console.error("Failed to create plan:", error);
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    });
};

createSubscriptionPlans();
