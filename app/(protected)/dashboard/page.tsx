import { auth } from '@/auth'
import React from 'react'

const Dashboard = async () => {

   const session = await auth();

   if (!session) {
      return <p>Access denied. Please log in.</p>;
   }

   return (
      <div>
         {session.user.role.name == "ADMIN" && <span>ADMIN</span>}
         Dashboard
         <span>{JSON.stringify(session)}</span>
      </div>
   )
}

export default Dashboard