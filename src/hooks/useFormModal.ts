interface UseFormModalProps<TFormData> {
  onSubmit: (
    data: FormData
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  onSuccess: () => void;
}
