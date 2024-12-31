'use client'

import React from 'react'
import LoginForm from './_components/login-form'
import { Card } from '@/src/components/ui/card'

const LoginPage = () => {
   return (
      <div className="relative flex items-center justify-center h-screen bg-gray-50 overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/school-background.jpg)' }}>
         {/* Ajout d'un overlay sombre pour améliorer la visibilité du texte */}
         {/* <div className="absolute inset-0 bg-black opacity-40 z-0"></div> */}

         {/* Grands cercles indigo avec animation */}
         <div className="absolute -top-1/3 -right-64 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-700 via-indigo-900 to-indigo-800 bg-[length:400%_400%] gradient rounded-full z-10"></div>
         <div className="absolute -bottom-1/3 -left-60 w-[500px] h-[500px] bg-gradient-to-br from-indigo-700 via-indigo-900 to-indigo-800 bg-[length:400%_400%] gradient rounded-full z-10"></div>

         {/* Formes décoratives dispersées */}
         <div className="absolute bottom-10 right-32 sm:right-5 w-[120px] h-[120px] bg-yellow-400 rounded-full opacity-50 animate-pulse z-10"></div>
         <div className="absolute top-40 right-20 sm:flex-none w-[120px] h-[120px] bg-orange-400 opacity-50 animate-pulse z-10"></div>
         <div className="absolute bottom-16 left-16 w-[150px] h-[150px] bg-purple-600 rounded-full opacity-40 animate-pulse z-10"></div>
         <div className="absolute top-48 right-1/4 w-[80px] h-[80px] bg-purple-600 rounded-full opacity-40 animate-pulse z-10"></div>

         {/* Formes carrées dispersées */}
         <div className="absolute top-4 left-1/4 w-[120px] h-[120px] bg-red-500 opacity-60 animate-pulse z-10"></div>

         {/* Triangles dispersés */}
         <div className="absolute top-32 left-28 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[120px] border-b-yellow-500 opacity-70 animate-pulse z-10"></div>
         <div className="absolute bottom-5 left-1/4 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-red-500 opacity-60 animate-pulse z-10"></div>
         <div className="absolute top-5 right-72 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-red-500 opacity-60 animate-pulse z-10"></div>

         {/* Section principale (formulaire) */}
         <Card className="z-20 flex flex-col items-center justify-center px-6 sm:px-16 lg:px-24">
            <div className="w-full max-w-md space-y-8">
               {/* Titre */}
               <div className="text-center animate__animated animate__fadeIn animate__delay-2s mb-6">
                  <h2 className="text-2xl font-extrabold text-gray-800">
                     Connectez-vous à AMS
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                     Accédez à votre compte et gérez vos données facilement.
                  </p>
               </div>
               <LoginForm />
            </div>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
               By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
               and <a href="#">Privacy Policy</a>.
            </div>
         </Card>
      </div>
   )
}

export default LoginPage
