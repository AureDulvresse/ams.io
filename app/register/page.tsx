"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(
  publishableKey
    ? publishableKey
    : "pk_test_51QBbqJP6eJzzzjXolXsqMhPeUtPiUS9vA6ILNZryzj3fzmM4LQbBWMKH0Lx9OxoK0XPJOOEh6fgDgY15bT5RVaQs00c67eAUGN"
);

const RegisterForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    planId: "",
    schoolName: "",
    schoolAddress: "",
    schoolPhone: "",
    schoolEmail: "",
  });

  const validateStep = () => {
    if (step === 1 && !formData.planId) return false;
    if (step === 2 && (!formData.schoolName || !formData.schoolEmail))
      return false;
    return true;
  };

  const handleNextStep = async () => {
    if (!validateStep()) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    if (step === 2) {
      const stripe = await stripePromise;

      if (!stripe) {
        toast.warning(
          "Stripe n'a pas été chargé correctement. Veuillez réessayer."
        );
        return;
      }

      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const session = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) toast.error(error.message);
    } else {
      setStep(step + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlanSelect = (planId: string) => {
    setFormData({
      ...formData,
      planId,
    });
    setStep(step + 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <form>
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Choisissez un plan d'abonnement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative border border-gray-200 p-6 rounded-2xl shadow-md transition-transform transform hover:scale-105 duration-300">
                <h3 className="text-xl font-semibold text-gray-700">
                  Plan Basique
                </h3>
                <p className="mt-4 text-gray-600">
                  Idéal pour les petites écoles.
                </p>
                <ul className="list-disc ml-5 mt-4 text-gray-500 space-y-2">
                  <li>5 utilisateurs</li>
                  <li>Support par email</li>
                  <li>Gestion basique des étudiants</li>
                </ul>
                <p className="mt-6 text-2xl font-bold text-blue-600">
                  9.99€/mois
                </p>
                <button
                  type="button"
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
                  onClick={() => handlePlanSelect("basic")}
                >
                  Sélectionner
                </button>
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  Populaire
                </div>
              </div>

              <div className="border border-gray-200 p-6 rounded-2xl shadow-md transition-transform transform hover:scale-105 duration-300">
                <h3 className="text-xl font-semibold text-gray-700">
                  Plan Pro
                </h3>
                <p className="mt-4 text-gray-600">
                  Idéal pour les écoles moyennes.
                </p>
                <ul className="list-disc ml-5 mt-4 text-gray-500 space-y-2">
                  <li>50 utilisateurs</li>
                  <li>Support prioritaire</li>
                  <li>Gestion avancée des étudiants</li>
                </ul>
                <p className="mt-6 text-2xl font-bold text-blue-600">
                  29.99€/mois
                </p>
                <button
                  type="button"
                  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
                  onClick={() => handlePlanSelect("pro")}
                >
                  Sélectionner
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Informations sur l'école
            </h2>
            <input
              type="text"
              name="schoolName"
              placeholder="Nom de l'école"
              value={formData.schoolName}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="email"
              name="schoolEmail"
              placeholder="Email de l'école"
              value={formData.schoolEmail}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="text"
              name="schoolPhone"
              placeholder="Téléphone de l'école"
              value={formData.schoolPhone}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              name="schoolAddress"
              placeholder="Adresse de l'école"
              value={formData.schoolAddress}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}

        {(step === 1 || step === 2) && (
          <button
            type="button"
            onClick={handleNextStep}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            {step === 1 ? "Suivant" : "Passer au Paiement"}
          </button>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
