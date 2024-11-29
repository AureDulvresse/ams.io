"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import SelectField from "@/components/common/SelectField";
import ErrorCard from "@/components/partials/ErrorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import useFetchData from "@/hooks/useFetchData";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState("1");

  const { login, isLoading, isAuthenticated } = useAuth();

  const {
    data: schools,
    isLoading: loadDepartment,
    error,
  } = useFetchData<any[]>("/api/schools");

  const schoolOptions = [{ label: "Academia", value: "1" }];

  const handleDepartmentChange = (value: string) => {
    setSchool(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password, school);

    if (!isAuthenticated) {
      toast.error("Erreur de connexion, veuillez vérifier vos identifiants.", {
        position: "bottom-right",
      });
    }
  };

  if (error) return <ErrorCard message={error.message} />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 to-teal-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg transition-transform transform">
        <h2 className="text-2xl font-bold font-fredoka text-center text-indigo-500">
          {step === 1 ? "Sélectionner votre école" : "Connexion"}
        </h2>
        {step === 1 ? (
          <div>
            <SelectField
              label="École"
              name="school_id"
              placeholder="Choisissez une école"
              isLoading={loadDepartment}
              options={schoolOptions}
              onChange={handleDepartmentChange}
              required={true}
            />
            <Button
              className="w-full py-2 mt-4 font-semibold text-white bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-md hover:scale-105 transition-transform duration-200"
              onClick={() => setStep(2)}
              disabled={!school}
            >
              Suivant
            </Button>
            <p className="mt-4 text-center text-gray-600">
              Votre école n'est pas enregistré ?{" "}
              <Link
                href="/register"
                className="text-indigo-600 hover:underline"
              >
                Inscrivez votre école ici
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <Input
                type="password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center">
              <Checkbox
                value={rememberMe}
                onChange={(e) => setRememberMe(e.currentTarget.value)}
                className="mr-2 checked:bg-indigo-500 checked:text-white"
              />
              <label className="text-sm text-gray-600">
                Se souvenir de moi
              </label>
            </div>
            <div className="flex justify-between">
              <Button
                variant="secondary"
                type="button"
                className="mt-4 text-gray-600"
                onClick={() => setStep(1)} // Retour à l'étape précédente
              >
                Retour
              </Button>
              <Button
                type="submit"
                className="mt-4 font-semibold text-white bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-md hover:scale-105 transition-transform duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="animate-spin text-white" size={15} />
                    <span className="text-white">Traitement...</span>
                  </div>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
