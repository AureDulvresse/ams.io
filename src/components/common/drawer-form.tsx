import React, { useEffect } from 'react';
import { useForm, FieldValues, DefaultValues, UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
   Drawer,
   DrawerContent,
   DrawerHeader,
   DrawerTitle,
   DrawerFooter,
   DrawerClose,
} from '@/src/components/ui/drawer';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { Form } from '@/src/components/ui/form';
import { useServerAction } from '@/src/hooks/use-server-action';

// Types
export type FormComponentProps<TFormData extends FieldValues> = {
   form: UseFormReturn<TFormData>;
};

export type DrawerFormProps<TFormData extends FieldValues> = {
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
   side?: 'left' | 'right' | 'top' | 'bottom';
};

const DrawerForm = <TFormData extends FieldValues>({
   isOpen,
   onClose,
   title,
   defaultValues,
   children,
   submitText = "Enregistrer",
   cancelText = "Annuler",
   loadingText = "Chargement...",
   successMessage = "Enregistrement effectué",
   serverAction,
   className,
   invalidQuery = [],
   preventCloseOnSuccess = false,
   resetOnClose = true,
   onSuccessCallback,
   side = 'bottom',
}: DrawerFormProps<TFormData>): JSX.Element => {
   const form = useForm<TFormData>({
      defaultValues,
   });

   // Reset form when drawer closes
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

   return (
      <Drawer open={isOpen} onOpenChange={handleClose} direction={side}>
         <DrawerContent className={cn("max-h-[95vh]", className)}>
            <DrawerHeader className="px-4 py-2">
               <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-4" noValidate>
                  <div className="overflow-y-auto">
                     {enhanceChildrenWithForm(children)}
                  </div>

                  <DrawerFooter className="px-4 py-4">
                     <div className="flex justify-end gap-3">
                        <DrawerClose asChild>
                           <Button
                              type="button"
                              variant="outline"
                              disabled={form.formState.isSubmitting}
                           >
                              {cancelText}
                           </Button>
                        </DrawerClose>
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
                     </div>
                  </DrawerFooter>
               </form>
            </Form>
         </DrawerContent>
      </Drawer>
   );
};

export default DrawerForm;