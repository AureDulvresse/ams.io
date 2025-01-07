import React, { ReactNode } from 'react';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";

interface ModalConfirmProps {
   trigger?: ReactNode;
   title?: string;
   description?: string;
   cancelText?: string;
   confirmText?: string;
   onConfirm?: () => void;
   onCancel?: () => void;
   children?: ReactNode;
}

const ModalConfirm = ({
   trigger = "Show Dialog",
   title = "Are you absolutely sure?",
   description = "This action cannot be undone.",
   cancelText = "Cancel",
   confirmText = "Continue",
   onConfirm = () => { },
   onCancel = () => { },
   children
}: ModalConfirmProps) => {
   const handleConfirm = React.useCallback(() => {
      onConfirm();
   }, [onConfirm]);

   const handleCancel = React.useCallback(() => {
      onCancel();
   }, [onCancel]);

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            {typeof trigger === 'string' ? (
               <Button variant="outline">{trigger}</Button>
            ) : (
               trigger
            )}
         </AlertDialogTrigger>
         <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
               <AlertDialogTitle>{title}</AlertDialogTitle>
               <AlertDialogDescription>
                  {description}
                  {children}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel onClick={handleCancel}>
                  {cancelText}
               </AlertDialogCancel>
               <AlertDialogAction onClick={handleConfirm}>
                  {confirmText}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default ModalConfirm;