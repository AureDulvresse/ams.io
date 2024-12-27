"use client"
import { logout } from '@/src/actions/auth.actions';
import { Button } from '@/src/components/ui/button';
import { useSession } from 'next-auth/react';
import React from 'react'
import { toast } from 'sonner';

const Dashboard = () => {

   const session = useSession();

   const handleLogout = async () => {
      await logout();
      toast.success("Déconnexion réussie !")
   }

   if (!session.status) {
      return <p>Access denied. Please log in.</p>;
   }

   return (
      <div>
         {session.data?.user.role.name == "superuser" && <h1 className='uppercase'>{session.data.user.role.name}</h1>}
         <h1>Dashboard</h1>
         <span>{JSON.stringify(session)}</span>
         <Button onClick={handleLogout}>logout</Button>
      </div>
   )
}

export default Dashboard