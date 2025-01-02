import React, { useEffect, useState } from "react";
import {
   DollarSignIcon,
   FileTextIcon,
   UsersIcon,
   CalendarIcon,
} from "lucide-react";
import StatCard from "@/src/components/common/stat-card";
import { Card } from "@/src/components/ui/card";
import IncomeChart from "@/src/components/finance/income-chart";
import ExpenseChart from "@/src/components/finance/expense-chart";
import { getTransaction } from "@/src/data/finance";
import { Payment, transactionColumns } from "@/constants/transaction-columns";
import { DataTable } from "@/src/components/common/data-table";
import ErrorState from "@/src/components/common/error-state";


const FinanceDashboard = () => {
   const [transactions, setTransactions] = useState<Payment[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchTransactions = async () => {
         try {
            setIsLoading(true);
            const data = await getTransaction();
            setTransactions(data);
         } catch (err: any) {
            setError(err.message);
         } finally {
            setIsLoading(false);
         }
      };

      fetchTransactions();
   }, []);

   const handleView = (row: any) => {
      console.log("Viewing:", row);
   };

   const handleEdit = (row: any) => {
      console.log("Editing:", row);
   };

   const handleDelete = (row: any) => {
      console.log("Deleting:", row);
   };

   const handleAdd = () => {
      console.log("Adding new record");
   };

   if (error) return <ErrorState message={error} />

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <div className="space-y-8">
         {/* Vue d'ensemble des finances */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
               libelle="Revenus totaux"
               data={35000}
               icon={DollarSignIcon}
               comparison={+5.3}
               unity="€"
            />
            <StatCard
               libelle="Dépenses totales"
               data={21000}
               icon={FileTextIcon}
               comparison={-2.4}
               unity="€"
            />
            <StatCard
               libelle="Balance actuelle"
               data={14000}
               icon={UsersIcon}
               comparison={+3.1}
               unity="€"
            />
            <StatCard
               libelle="Transactions récentes"
               data={12}
               icon={CalendarIcon}
               comparison={+1.1}
               unity="🔄"
            />
         </div>

         {/* Graphiques - Revenus et Dépenses */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
               <IncomeChart />
            </div>
            <div className="col-span-1">
               <ExpenseChart />
            </div>
         </div>

         {/* Section des transactions récentes */}
         <Card className="container mx-auto px-4 py-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Transactions récentes</h2>
            <DataTable
               columns={transactionColumns}
               data={transactions}
               onView={handleView}
               onEdit={handleEdit}
               onDelete={handleDelete}
               onAdd={handleAdd}
            />
         </Card>
      </div>
   );
};

export default FinanceDashboard;
