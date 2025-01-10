import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { subjectSchema } from "../schemas/course.schema";

interface SubjectFormFieldsProps {
   form: UseFormReturn<z.infer<typeof subjectSchema>>;
}

export const SubjectFormFields: React.FC<SubjectFormFieldsProps> = ({
   form,
}) => {
   return (
      <div className="space-y-4">
         <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Nom de la matière</FormLabel>
                  <FormControl>
                     <Input placeholder="Ex: Mathématiques" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Code de la matière</FormLabel>
                  <FormControl>
                     <Input placeholder="Ex: MATH" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                     <Textarea
                        placeholder="Description de la matière..."
                        className="min-h-[100px]"
                        {...field}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </div>
   );
};
