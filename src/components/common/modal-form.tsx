import React from 'react';
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
   serverAction: (data: TFormData) => Promise<{ success: boolean; error?: string }>;
   className?: string;
};

const ModalForm = <TFormData extends FieldValues>({
   isOpen,
   onClose,
   title,
   defaultValues,
   children,
   submitText = "Save",
   serverAction,
   className,
}: ModalFormProps<TFormData>): JSX.Element => {
   const form = useForm<TFormData>({
      defaultValues,
   });

   const handleSubmit = async (formData: TFormData): Promise<void> => {
      try {
         const result = await serverAction(formData);

         if (result.success) {
            form.reset();
            onClose();
         } else {
            // You might want to use a toast notification here instead of console.error
            console.error('Submission error:', result.error);
         }
      } catch (error) {
         console.error('Form submission failed:', error);
         // Handle the error appropriately - maybe show a toast or set form error
      }
   };

   const enhanceChildrenWithForm = (children: React.ReactElement<FormComponentProps<TFormData>> | React.ReactElement<FormComponentProps<TFormData>>[]): React.ReactNode => {
      return React.Children.map(children, (child) => {
         if (React.isValidElement(child)) {
            return React.cloneElement(child, { form });
         }
         return child;
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className={cn('sm:max-w-lg', className)}>
            <DialogHeader>
               <DialogTitle className="flex items-center justify-between">
                  {title}
                  <Button
                     variant="ghost"
                     size="icon"
                     className="h-6 w-6 rounded-md"
                     onClick={onClose}
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
               <div className="space-y-4 py-4">
                  {enhanceChildrenWithForm(children)}
               </div>

               <DialogFooter className="gap-2">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     disabled={form.formState.isSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     disabled={form.formState.isSubmitting}
                  >
                     {form.formState.isSubmitting ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Loading...
                        </>
                     ) : (
                        submitText
                     )}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default ModalForm;