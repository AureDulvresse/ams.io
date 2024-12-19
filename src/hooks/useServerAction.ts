import { useState } from "react";

// Le type générique pour une mutation
type MutationAction = "create" | "update" | "delete";

const useServerAction = <T>(
  url: string,
  action: MutationAction,
  schema?: any
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const executeAction = async (payload: T | null = null) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    // Validation avec Zod
    if (schema) {
      const result = schema.safeParse(payload);
      if (!result.success) {
        // Extraire les erreurs de validation
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err: { path: string[]; message: string; }) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        setIsLoading(false);
        return {isSuccess: false, message: errorMessage}; // Arrêter si la validation échoue
      } else {
        setValidationErrors({});
      }
    }

    let method;
    switch (action) {
      case "create":
        method = "POST";
        break;
      case "update":
        method = "PUT";
        break;
      case "delete":
        method = "DELETE";
        break;
      default:
        throw new Error("Action non supportée");
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : null,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.message || `Erreur lors de l'exécution de l'action ${action}`);
        setIsError(true);
        setIsLoading(false);
        return {isSuccess: false, message: errorResponse.message}; // Arrêter ici si la requête échoue
      }

      const result = await response.json();
      setData(result);
      setIsLoading(false);
      return {isSuccess: true, message: errorMessage}; // Succès
    } catch (error) {
      setIsError(true);
      setErrorMessage((error as Error).message);
      setIsLoading(false);
      return {isSuccess: false, message: errorMessage}; ; // Arrêter si une exception survient
    }
  };

  return {
    isLoading,
    isError,
    errorMessage,
    validationErrors,
    data,
    executeAction,
  };
};


export default useServerAction;
