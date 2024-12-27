import LoginForm from '@/src/forms/login-form'
import React from 'react'

const LoginPage = () => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-screen">
         
         <div className="hidden md:flex items-center justify-center bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-[length:400%_400%] animate-gradient">
            <h1 className="text-5xl font-extrabold text-white text-center leading-tight px-4">
               Bienvenue sur<br />
               <span className="text-indigo-400">Academia Management Sync</span>
            </h1>
         </div>

         
         <div className="flex flex-col items-center justify-center px-8">
            <div className="w-full max-w-md space-y-8">
               <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800">
                     Connexion à votre espace
                  </h2>
                  <p className="text-sm text-gray-600">
                     Gérez votre établissement facilement et efficacement.
                  </p>
               </div>
               <LoginForm />
            </div>
         </div>
      </div>
   )
}

export default LoginPage
