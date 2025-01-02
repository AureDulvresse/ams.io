'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Mail, Lock } from 'lucide-react'
import { signInSchema } from '@/src/schemas/auth.schema'
import { login } from '@/src/actions/auth.actions'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   Form,
} from '@/src/components/ui/form'

type LoginFormValues = z.infer<typeof signInSchema>

const LoginForm = () => {
   const [loading, setLoading] = useState(false)
   const router = useRouter()

   const form = useForm<LoginFormValues>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   })

   const onSubmit = async (data: LoginFormValues) => {
      setLoading(true)

      try {
         const result = await login(data)

         if (result?.error) {
            toast.error(result.error)
            return
         }

         toast.success("Connexion réussie !")
         router.push('/dashboard')

      } catch (err: any) {
         toast.error(err.message)
      } finally {
         setLoading(false)
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                           <Input
                              {...field}
                              placeholder="nom@exemple.fr"
                              type="email"
                              className="pl-10"
                              disabled={loading}
                           />
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center justify-between">
                        <FormLabel>Mot de passe</FormLabel>
                        <a
                           href="/forgot-password"
                           className="text-xs text-muted-foreground hover:text-primary"
                        >
                           Mot de passe oublié?
                        </a>
                     </div>
                     <FormControl>
                        <div className="relative">
                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                           <Input
                              {...field}
                              type="password"
                              className="pl-10"
                              placeholder="••••••••"
                              disabled={loading}
                           />
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex items-center space-x-2">
               <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
               />
               <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
               >
                  Se souvenir de moi
               </Label>
            </div>

            <Button
               type="submit"
               className="w-full"
               disabled={loading}
            >
               {loading ? (
                  <div className="flex items-center gap-2">
                     <Loader2 className="h-4 w-4 animate-spin" />
                     <span>Connexion en cours...</span>
                  </div>
               ) : (
                  'Se connecter'
               )}
            </Button>
         </form>
      </Form>
   )
}

export default LoginForm