import { useFormContext } from "react-hook-form";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../components/ui/form";
import { FormComponentProps } from "../components/common/modal-form";
import { Input } from "../components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../components/ui/select";

export const DepartmentFormFields = ({
   form,
}: FormComponentProps<{
   name: string;
   code: string;
   type: "academic" | "administrative" | "service";
   description?: string | undefined;
}>) => {

   return (
      <div className="space-y-4">
         {/* Champ pour le nom */}
         <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                     <Input {...field} placeholder="Nom du rôle" />
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
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                     <Input {...field} placeholder="Code" />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Type de departement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                        <SelectTrigger>
                           <SelectValue placeholder="Selectionner le type de departement" />
                        </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                        <SelectItem value="academic">Académique</SelectItem>
                        <SelectItem value="administrative">Administratif</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                     </SelectContent>
                  </Select>
                  <FormMessage />
               </FormItem>
            )}
         />
         {/* Champ pour la description */}
         <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                     <Input
                        {...field}
                        placeholder="Description du departement (facultatif)"
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
      </div>
   );
};
