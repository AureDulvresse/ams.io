'use client'

import LoginForm from '@/src/forms/login-form'
import React from 'react'

const LoginPage = () => {
   return (
      <div className="relative flex items-center justify-center h-screen bg-gray-50 overflow-hidden">
         {/* Section gauche (décorative avec formes liées à l'école) */}
         <div className="hidden lg:flex absolute top-0 left-0 h-full w-1/3 bg-gradient-to-tl from-indigo-700 via-indigo-900 to-indigo-800 bg-[length:400%_400%] animate-gradient rounded-tr-full rounded-br-full flex-col items-center justify-center text-center p-6">
            {/* Formes décoratives visibles */}
            <div className="absolute top-1/4 left-1/4 w-[120px] h-[120px] bg-yellow-400 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-[180px] h-[180px] bg-white rounded-full opacity-40 animate-bounce"></div>
            <div className="absolute top-2/3 left-1/4 w-[100px] h-[100px] bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
         </div>

         {/* Section droite (décorative avec formes liées à l'école) */}
         <div className="hidden lg:flex absolute -bottom-1/2 right-0 h-[680px] w-[680px] bg-gradient-to-tl from-indigo-700 via-indigo-900 to-indigo-800 bg-[length:400%_400%] animate-gradient rounded-tl-full rounded-bl-full">
            {/* Formes décoratives visibles */}
            <div className="absolute bottom-10 right-10 w-[120px] h-[120px] bg-yellow-500 rounded-lg opacity-30 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-[150px] h-[150px] bg-blue-500 rounded-full opacity-40 animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-[80px] h-[80px] bg-green-500 rounded-full opacity-50 animate-pulse"></div>
         </div>

         {/* Section principale (formulaire) */}
         <div className="z-10 flex flex-col items-center justify-center px-6 sm:px-16 lg:px-24">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
               {/* Titre */}
               <div className="text-center animate__animated animate__fadeIn animate__delay-2s">
                  <h2 className="text-2xl font-extrabold text-gray-800">
                     Connectez-vous à AMS
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                     Accédez à votre compte et gérez vos données facilement.
                  </p>
               </div>
               <LoginForm />
            </div>
         </div>
      </div>
   )
}

export default LoginPage
