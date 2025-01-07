import React, { useEffect } from 'react';
import { useForm, FieldValues, DefaultValues, UseFormReturn } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { Form } from '@/src/components/ui/form';
import { useServerAction } from '@/src/hooks/use-server-action';

// Types
export type FormComponentProps<TFormData extends FieldValues> = {
   form: UseFormReturn<TFormData>;
};

export type ModalFormProps<TFormData extends FieldValues> = {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   defaultValues?: DefaultValues<TFormData>;
   children: React.ReactElement<FormComponentProps<TFormData>> | React.ReactElement<FormComponentProps<TFormData>>[];
   submitText?: string;
   successMessage?: string;
   cancelText?: string;
   loadingText?: string;
   serverAction: (data: TFormData) => Promise<{ success: boolean; data?: any; error?: string }>;
   className?: string;
   invalidQuery?: string[];
   preventCloseOnSuccess?: boolean;
   resetOnClose?: boolean;
   onSuccessCallback?: (data: any) => void;
   width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

const ModalForm = <TFormData extends FieldValues>({
   isOpen,
   onClose,
   title,
   defaultValues,
   children,
   submitText = "Save",
   cancelText = "Cancel",
   loadingText = "Loading...",
   successMessage = "Enregistrement effectué",
   serverAction,
   className,
   invalidQuery = [],
   preventCloseOnSuccess = false,
   resetOnClose = true,
   onSuccessCallback,
   width = 'lg',
}: ModalFormProps<TFormData>): JSX.Element => {
   const form = useForm<TFormData>({
      defaultValues,
   });

   // Reset form when modal closes
   useEffect(() => {
      if (!isOpen && resetOnClose) {
         form.reset(defaultValues);
      }
   }, [isOpen, form, defaultValues, resetOnClose]);

   const handleClose = () => {
      if (!form.formState.isSubmitting) {
         onClose();
      }
   };

   const mutation = useServerAction(serverAction, {
      onSuccess: (data) => {
         if (!preventCloseOnSuccess) {
            form.reset();
            onClose();
         }
         toast.success(successMessage);
         onSuccessCallback?.(data);
      },
      onError: (error) => {
         toast.error(error.message);
         console.error('Submission error:', error);
      },
      invalidateQueries: invalidQuery,
   });

   const handleSubmit = async (formData: TFormData): Promise<void> => {
      try {
         mutation.mutate(formData);
      } catch (error) {
         console.error('Unexpected error during submission:', error);
         toast.error('Une erreur inattendue est survenue');
      }
   };

   const enhanceChildrenWithForm = (
      children: React.ReactElement<FormComponentProps<TFormData>> | React.ReactElement<FormComponentProps<TFormData>>[]
   ): React.ReactNode => {
      return React.Children.map(children, (child) => {
         if (React.isValidElement(child)) {
            return React.cloneElement(child, { form });
         }
         return child;
      });
   };

   const dialogSizeClass = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
   }[width];

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className={cn(dialogSizeClass, className)}>
            <DialogHeader>
               <DialogTitle className="flex items-center justify-between">
                  {title}
                  <Button
                     type="button"
                     variant="ghost"
                     className="h-8 w-8 p-0"
                     onClick={handleClose}
                     disabled={form.formState.isSubmitting}
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="relative space-y-6"
                  noValidate
               >
                  {enhanceChildrenWithForm(children)}

                  <DialogFooter className="gap-2 pt-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={form.formState.isSubmitting}
                     >
                        {cancelText}
                     </Button>
                     <Button
                        type="submit"
                        disabled={form.formState.isSubmitting || !form.formState.isDirty || mutation.isPending}
                     >
                        {form.formState.isSubmitting || mutation.isPending ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {loadingText}
                           </>
                        ) : (
                           submitText
                        )}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default ModalForm;