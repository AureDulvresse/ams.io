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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { courseSchema } from "../schemas/course.schema";
import { Subject } from "../types/course";
import { MultiSelect } from "../components/common/multi-select";

interface CourseFormFieldsProps {
   form: UseFormReturn<z.infer<typeof courseSchema>>;
   subjects: Subject[];
}

export const CourseFormFields: React.FC<CourseFormFieldsProps> = ({
   form,
   subjects,
}) => {
   return (
      <div className="space-y-4">
         <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Nom du cours</FormLabel>
                  <FormControl>
                     <Input placeholder="Ex: Algèbre linéaire" {...field} />
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
                  <FormLabel>Code du cours</FormLabel>
                  <FormControl>
                     <Input placeholder="Ex: MATH101" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Matière</FormLabel>
                  <Select
                     onValueChange={(value) => field.onChange(parseInt(value))}
                     defaultValue={field.value?.toString()}
                  >
                     <FormControl>
                        <SelectTrigger>
                           <SelectValue placeholder="Sélectionner une matière" />
                        </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                        {subjects.map((subject) => (
                           <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Nombre de crédits</FormLabel>
                  <FormControl>
                     <Input
                        type="number"
                        placeholder="Ex: 3"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="prerequisites"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Selectionnez des préréquis</FormLabel>
                  <FormControl>
                     <MultiSelect
                        options={[]}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Sélectionnez des préréquis"
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
                        placeholder="Description du cours..."
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