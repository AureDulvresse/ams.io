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
import { subjectSchema } from "@/src/schemas/subject.schema";
import { MultiSelect } from "../components/common/multi-select";
import { Department } from "../types/department";

interface SubjectFormFieldsProps {
   form: UseFormReturn<z.infer<typeof subjectSchema>>;
   departments: Department[];
}

export const SubjectFormFields: React.FC<SubjectFormFieldsProps> = ({
   form,
   departments,
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
            name="departmentIds"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Departements</FormLabel>
                  <FormControl>
                     <MultiSelect
                        options={departments.map((d) => ({
                           label: d.name,
                           value: d.id,
                        }))}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Sélectionnez un departement"
                     />
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
