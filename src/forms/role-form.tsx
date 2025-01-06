import ErrorState from "../components/common/error-state";
import FetchLoader from "../components/common/fetch-loader"; // Correction du nom du composant
import { FormComponentProps } from "../components/common/modal-form";
import { MultiSelect } from "../components/common/multi-select";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import useFetchData from "../hooks/use-fetch-data";
import { Permission } from "../types/permission";

export const RoleFormFields = ({
   form,
}: FormComponentProps<{
   name: string;
   description?: string;
   permissionIds: number[];
}>) => {
   const {
      data: listPermissions,
      isLoading,
      error,
   } = useFetchData<Permission[]>("/api/permissions");

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
                        placeholder="Description du rôle (facultatif)"
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Gestion des permissions */}
         {isLoading && (
            <div className="h-36 rounded-lg">
               <FetchLoader />
            </div>
         )}

         {error && (
            <div className="h-36 rounded-lg">
               <ErrorState message={error.message} />
            </div>
         )}

         {listPermissions && (
            <FormField
               control={form.control}
               name="permissionIds"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Permissions</FormLabel>
                     <FormControl>
                        <MultiSelect
                           options={listPermissions.map((perm) => ({
                              label: perm.name,
                              value: perm.id,
                           }))}
                           value={field.value || []}
                           onChange={field.onChange}
                           placeholder="Sélectionnez des permissions"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         )}
      </div>
   );
};
