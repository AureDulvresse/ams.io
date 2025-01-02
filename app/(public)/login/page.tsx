'use client'

import React from 'react';
import LoginForm from './_components/login-form';
import { Card } from '@/src/components/ui/card';

const LoginPage = () => {
   return (
      <div className="min-h-screen w-full flex">
         {/* Left side - Login Form */}
         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
               {/* En-tête */}
               <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tight">Bienvenue sur AMS</h1>
                  <p className="text-sm text-muted-foreground">
                     Connectez-vous à votre compte pour accéder à votre tableau de bord
                  </p>
               </div>

               {/* Card contenant le formulaire */}
               <Card className="p-6">
                  <LoginForm />
               </Card>

               {/* Liens supplémentaires */}
               <div className="text-center space-y-2">
                  {/* <div className="text-sm text-muted-foreground">
                     Pas encore de compte?{' '}
                     <a href="/register" className="text-primary hover:underline">
                        Créer un compte
                     </a>
                  </div> */}
                  <div className="text-xs text-muted-foreground">
                     En vous connectant, vous acceptez nos{' '}
                     <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Conditions d'utilisation
                     </a>
                     {' '}et notre{' '}
                     <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Politique de confidentialité
                     </a>
                  </div>
               </div>
            </div>
         </div>

         {/* Right side - Image with Shape */}
         <div className="hidden lg:block w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 transform -skew-x-6">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-violet-600/90 mix-blend-multiply" />
               <img
                  src="/api/placeholder/800/1200"
                  alt="Login visual"
                  className="h-full w-full object-cover"
               />
            </div>

            {/* Overlay text */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-4">
               <h2 className="text-2xl font-bold">Gérez votre entreprise efficacement</h2>
               <p className="text-sm opacity-90">
                  Accédez à tous vos outils et données en un seul endroit
               </p>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;