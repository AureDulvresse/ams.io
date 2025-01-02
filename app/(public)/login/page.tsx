"use client";

import React from 'react';
import LoginForm from './_components/login-form';
import { Card } from '@/src/components/ui/card';
import Image from 'next/image';

const LoginPage = () => {
   return (
      <div className="min-h-screen w-full flex bg-slate-50">
         {/* Left side - Login Form */}
         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
               {/* Card contenant le formulaire */}
               <Card className="p-8 shadow-xl bg-white/50 backdrop-blur-sm border-0">
                  <LoginForm />
               </Card>

               <div className="text-center space-y-6">
                  <div className="text-xs text-muted-foreground">
                     En vous connectant, vous acceptez nos{' '}
                     <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
                        Conditions d'utilisation
                     </a>
                     {' '}et notre{' '}
                     <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
                        Politique de confidentialité
                     </a>
                  </div>
               </div>
            </div>
         </div>

         {/* Right side - Image with Wave Shape */}
         <div className="hidden lg:block w-[60%] relative">
            {/* SVG Mask for wave shape */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
               <defs>
                  <clipPath id="wave-clip">
                     <path d="M200,0 L1000,0 L1000,1000 L0,1000 C50,750 100,700 200,600 C300,500 250,400 200,300 C150,200 150,100 200,0" />
                  </clipPath>
               </defs>
            </svg>

            {/* Background with gradient and image */}
            <div className="absolute inset-0" style={{ clipPath: "url(#wave-clip)" }}>
               {/* Gradient overlay */}
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/95 to-violet-600/95 mix-blend-multiply" />

               {/* Background image */}
               <Image
                  src="/images/school-background.jpg"
                  alt="Login visual"
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
               />
            </div>
         </div>
      </div>
   );
};

export default LoginPage;
