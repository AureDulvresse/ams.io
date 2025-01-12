import React, { useEffect } from 'react';
import { useForm, FieldValues, DefaultValues, UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetFooter,
   SheetClose,
} from '@/src/components/ui/sheet';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { Form } from '@/src/components/ui/form';
import { useServerAction } from '@/src/hooks/use-server-action';

// Types
export type FormComponentProps<TFormData extends FieldValues> = {
   form: UseFormReturn<TFormData>;
};

export type SlideOverFormProps<TFormData extends FieldValues> = {
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
   side?: 'left' | 'right';
   size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
};

const SlideOverForm = <TFormData extends FieldValues>({
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
   side = 'right',
   size = 'default',
}: SlideOverFormProps<TFormData>): JSX.Element => {
   const form = useForm<TFormData>({
      defaultValues,
   });

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

   const sizeClasses = {
      sm: 'sm:max-w-sm',
      default: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      full: 'sm:max-w-full',
   };

   // Coins arrondis en fonction du côté d'ouverture
   const roundedClasses = side === 'right' ? 'rounded-l-xl' : 'rounded-r-xl';

   return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
         <SheetContent
            side={side}
            className={cn(
               "flex flex-col p-0 gap-0 w-full min-h-full h-full",
               roundedClasses,
               sizeClasses[size],
               className
            )}
         >
            <SheetHeader className="px-6 py-4 border-b">
               <SheetTitle>{title}</SheetTitle>
            </SheetHeader>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full" noValidate>
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                     <div className="space-y-6">
                        {enhanceChildrenWithForm(children)}
                     </div>
                  </div>

                  <SheetFooter className="px-6 py-4 border-t mt-auto">
                     <div className="flex justify-end gap-3 w-full">
                        <SheetClose asChild>
                           <Button
                              type="button"
                              variant="outline"
                              disabled={form.formState.isSubmitting}
                           >
                              {cancelText}
                           </Button>
                        </SheetClose>
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
                  </SheetFooter>
               </form>
            </Form>
         </SheetContent>
      </Sheet>
   );
};

export default SlideOverForm;