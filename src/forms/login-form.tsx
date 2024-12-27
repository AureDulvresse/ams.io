'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { signInSchema } from '../schemas/auth.schema'
import { Input } from '@/src/components/ui/input'
import { login } from '@/src/actions/auth.actions'
import { toast } from 'sonner'
import { Button } from '@/src/components/ui/button'
import { Loader2 } from 'lucide-react'

type LoginFormValues = z.infer<typeof signInSchema>

const LoginForm = () => {
   const [loading, setLoading] = useState(false)

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormValues>({
      resolver: zodResolver(signInSchema),
   })

   const onSubmit = async (data: LoginFormValues) => {
      setLoading(true)
      try {
         await login(data)
         toast.success("Connexion réussie", {
            description: "Bienvenue, vous êtes connecté(e) !",
         })
      } catch (err: any) {
         toast.error("Une erreur s'est produite", {
            description: err.message || "Impossible de se connecter. Vérifiez vos informations.",
            style: {
               backgroundColor: "#dc2626",
               color: "#ffffff",
            },
         })
      } finally {
         setLoading(false)
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

         <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
               Adresse email
            </label>
            <div className="mt-1">
               <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  {...register('email')}
                  className={`px-2 py-3 focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                     }`}
                  disabled={loading}
               />
            </div>
            {errors.email && (
               <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
         </div>


         <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
               Mot de passe
            </label>
            <div className="mt-1">
               <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...register('password')}
                  className={`px-2 py-3 focus:ring-indigo-500 focus:border-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                     }`}
                  disabled={loading}
               />
            </div>
            {errors.password && (
               <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
         </div>

         <div>
            <Button
               type="submit"
               className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md shadow-md transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
               disabled={loading}
            >
               {loading ? (
                  <div className="flex items-center gap-2">
                     <Loader2 className="animate-spin text-white" size={18} />
                     <span className="text-white">Traitement...</span>
                  </div>
               ) : (
                  'Se connecter'
               )}
            </Button>
         </div>
      </form>
   )
}

export default LoginForm
