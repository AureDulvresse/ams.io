import LoginForm from '@/src/forms/login-form'
import React from 'react'

const LoginPage = () => {
   return (
      <div className='grid grid-cols-2 w-full h-screen'>
         <div className='bg-gradient-to-tr from-gray-900 to-black flex items-center justify-center'>
            <h1 className="text-lg text-white font-semibold">Academia management Sync</h1>
         </div>
         <div className='flex flex-col items-center justify-center'>
           <LoginForm />
         </div>
      </div>
   )
}

export default LoginPage