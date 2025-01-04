import { Button } from "@/src/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/src/components/ui/dialog";

interface ModalFormProps {
   isOpen: boolean;
   title: string;
   description?: string;
   form: React.ReactNode;
   onClose: () => void;
   onCancel?: () => void;
   onSave?: (formData: FormData) => void;
   onConfirm?: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
   isOpen,
   title,
   description,
   form,
   onClose,
   onCancel,
   onSave,
   onConfirm,
}) => {
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
