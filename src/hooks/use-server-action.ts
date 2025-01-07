import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  MutationFunction,
} from "@tanstack/react-query";

// Types pour le format de réponse des server actions
export interface ServerActionResponse<TData = any> {
  success: boolean;
  data?: TData;
  error?: string;
}

// Type pour le server action
export type ServerAction<TInput> = (
  data: TInput
) => Promise<ServerActionResponse>;

export interface MutationConfig<TData = any> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
}

export function useServerAction<TInput>(
  serverAction: ServerAction<TInput>,
  config: MutationConfig
): UseMutationResult<ServerActionResponse, Error, TInput> {
  const queryClient = useQueryClient();
  const { onSuccess, onError, invalidateQueries = [] } = config;

  return useMutation({
    mutationFn: async (data: TInput) => {
      const response = await serverAction(data);

      if (!response.success) {
        // On crée une Error avec le message d'erreur du server action
        throw new Error(response.error || "Une erreur est survenue");
      }

      return response;
    },
    onSuccess: (response) => {
      // Invalider les queries spécifiées
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      // Appeler onSuccess avec les données si disponibles
      if (onSuccess) {
        onSuccess(response.data);
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      }
    },
  });
}

// Hook spécialisé pour la création
export function useCreate<TInput>(
  serverAction: ServerAction<TInput>,
  config?: MutationConfig
) {
  return useServerAction(serverAction, config || {});
}

// Hook spécialisé pour la mise à jour
export function useUpdate<TInput>(
  serverAction: ServerAction<TInput>,
  config?: MutationConfig
) {
  return useServerAction(serverAction, config || {});
}

// Hook spécialisé pour la suppression
export function useDelete<TInput>(
  serverAction: ServerAction<TInput>,
  config?: MutationConfig
) {
  return useServerAction(serverAction, config || {});
}
