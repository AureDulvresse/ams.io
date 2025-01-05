import { Button } from "@/src/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/src/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ModalFormProps<TFormData> {
   isOpen: boolean;
   title: string;
   description?: string;
   defaultValues?: Partial<TFormData>;
   children: React.ReactNode;
   onClose: () => void;
   submitText?: string;
   serverAction: (data: TFormData) => Promise<{ success: boolean; error?: string; }>;
   className?: string;
}

const ModalForm = <TFormData,>({
   isOpen,
   title,
   description,
   defaultValues,
   children,
   onClose,
   submitText,
   serverAction,
   className
}: ModalFormProps<TFormData>) => {

   const form = useForm<TFormData>({
      defaultValues: defaultValues as TFormData,

   })

   const onSubmit = async (formData: TFormData) : Promise<void> => {
      try {
         const result = await serverAction(formData);

         if (result.success) {
            form.reset()
            onClose();
            toast.success("")
         }
      } catch (error) {
         
      }
   }

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <div className="py-4">{form}</div>
            <DialogFooter className="flex justify-end gap-2">
               {onCancel && (
                  <Button variant={"outline"} onClick={() => onCancel()}>
                     Annuler
                  </Button>
               )}
               {onConfirm && (
                  <Button variant={"outline"} onClick={() => onConfirm()}>
                     Confirmer
                  </Button>
               )}
               {onSave && (
                  <Button variant={"outline"} onClick={() => onSave(formData as FormData)}>
                     Enregistrer
                  </Button>
               )}
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ModalForm;
