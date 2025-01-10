"use client";

import { Department } from "@/src/types/department";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Edit, Trash2, Users } from "lucide-react";
import { useState } from "react";
import ModalForm from "@/src/components/common/modal-form";
import { DepartmentFormFields } from "@/src/forms/department-form";
import { useForm } from "react-hook-form";
import { deleteDepartment, updateDepartment } from "@/src/actions/department.actions";
import { useDelete } from "@/src/hooks/use-server-action";
import { toast } from "sonner";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/src/components/ui/table";
import ModalConfirm from "@/src/components/common/modal-confirm";
import { departmentSchema } from "@/src/schemas/department.schema"; // Adjusted schema for Department
import { z } from "zod";

interface DepartmentDetailViewProps {
   department: Department;
}

export default function DepartmentDetailView({ department }: DepartmentDetailViewProps) {
   const router = useRouter();
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const departmentForm = useForm<z.infer<typeof departmentSchema>>();

   const deleteMutation = useDelete(deleteDepartment, {
      onSuccess: () => {
         toast.success("Département supprimé avec succès");
         router.push("/departments");
      },
      onError: (error) => {
         toast.error(error.message);
      },
      invalidateQueries: ["/api/departments", "list"],
   });

   const handleDelete = () => {
      deleteMutation.mutate(department.id);
   };

   return (
      <div className="p-6 space-y-6">
         <div className="flex items-center justify-between">
            <Button
               variant="outline"
               onClick={() => router.back()}
               className="gap-2"
            >
               <ArrowLeft className="w-4 h-4" />
               Retour
            </Button>
            <div className="flex gap-2">
               <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                  className="gap-2"
               >
                  <Edit className="w-4 h-4" />
                  Modifier
               </Button>
               <ModalConfirm
                  trigger={
                     <Button variant="destructive" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                     </Button>
                  }
                  title="Supprimer le département"
                  description={`Êtes-vous sûr de vouloir supprimer le département "${department.name}" ? Cette action est irréversible.`}
                  confirmText="Supprimer"
                  cancelText="Annuler"
                  onConfirm={handleDelete}
               />
            </div>
         </div>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <p className="uppercase">{department.name}</p>
               </CardTitle>
               <CardDescription>{department.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                  <h3 className="text-lg font-semibold mb-4">Programmes</h3>
                  {/* <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Nom</TableHead>
                           <TableHead>Description</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {department.programs?.map((program) => (
                           <TableRow key={program.id}>
                              <TableCell>{program.name}</TableCell>
                              <TableCell>{program.description}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table> */}
               </div>

               <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                     <Users className="w-5 h-5" />
                     Personnel dans ce département
                  </h3>
                  {/* <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Nom</TableHead>
                           <TableHead>Email</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {department.staff?.map((staff) => (
                           <TableRow key={staff.id}>
                              <TableCell>{staff.first_name} {staff.last_name}</TableCell>
                              <TableCell>{staff.email}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table> */}
               </div>

               <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                     Cours dans ce département
                  </h3>
                  {/* <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Nom du Cours</TableHead>
                           <TableHead>Description</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {department.courses?.map((course) => (
                           <TableRow key={course.id}>
                              <TableCell>{course.name}</TableCell>
                              <TableCell>{course.description}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table> */}
               </div>
            </CardContent>
         </Card>

         <ModalForm
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title={`Modifier le département: ${department.name}`}
            defaultValues={{
               name: department.name,
               description: department.description || "",
               code: department.code,
               type: department.type,
            }}
            serverAction={(data) => updateDepartment(department.id, data)}
            invalidQuery={["/api/departments", "list", `department-${department.id}`]}
            successMessage="Département modifié avec succès"
         >
            <DepartmentFormFields form={departmentForm} />
         </ModalForm>
      </div>
   );
}
