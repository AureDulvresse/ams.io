"use client"
import { logout } from '@/src/actions/auth.actions';
import { Button } from '@/src/components/ui/button';
import { useCurrentUser } from '@/src/hooks/use-current-user';
import React from 'react'
import { toast } from 'sonner';

const Dashboard = () => {

   const user = useCurrentUser();

   const handleLogout = async () => {
      await logout();
      toast.success("Déconnexion réussie !")
   }

   return (
      <div>
         {user?.role.name == "superuser" && <h1 className='uppercase'>{user.role.name}</h1>}
         <h1>Dashboard</h1>
         <span>{JSON.stringify(user)}</span>
         <Button onClick={handleLogout}>logout</Button>
      </div>
   )
}

export default Dashboard