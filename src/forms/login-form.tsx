'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { signInSchema } from '../schemas/auth.schema'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { login } from '../actions/auth.actions'
import { useRouter, useSearchParams } from 'next/navigation'

type LoginFormValues = z.infer<typeof signInSchema>

const LoginForm = () => {
   const [loading, setLoading] = useState(false)
   const navigate = useRouter()

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
         const result = await login(data)

         if (result.success) {
            toast.success(result.success)
            const old_url = useSearchParams().get('from')
            navigate.push(old_url || '/dashboard')
         }
         else {
            toast.error("Echec de connexion", {
               description: result.error
            })
         }

      } catch (err: any) {
         toast.error(err.message)
      } finally {
         setLoading(false)
      }
   }

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="max-w-md mx-auto space-y-8"
      >
         {/* Email */}
         <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
               Adresse email
            </label>
            <Input
               id="email"
               type="email"
               placeholder="exemple@domaine.com"
               {...register('email')}
               className="mt-1 w-full border rounded-lg px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
               disabled={loading}
            />
            {errors.email && (
               <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
         </div>

         {/* Mot de passe */}
         <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
               Mot de passe
            </label>
            <Input
               id="password"
               type="password"
               placeholder="********"
               {...register('password')}
               className="mt-1 w-full border rounded-lg px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
               disabled={loading}
            />
            {errors.password && (
               <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
         </div>

         {/* Bouton de soumission */}
         <div>
            <Button
               type="submit"
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg transition disabled:opacity-50"
               disabled={loading}
            >
               {loading ? (
                  <div className="flex items-center gap-2">
                     <Loader2 className="animate-spin" size={18} />
                     <span>Connexion en cours...</span>
                  </div>
               ) : (
                  'Connexion'
               )}
            </Button>
         </div>
      </form>
   )
}

export default LoginForm
