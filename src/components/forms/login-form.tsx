'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Eye, EyeOff, Loader2, LockKeyhole, UserCircle2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signInSchema } from "@/src/schemas/auth-schema"
import { z } from "zod"
import { login } from "@/src/actions/users/user.actions"

export const LoginForm = ({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"form">) => {
   const [showPassword, setShowPassword] = useState(false)
   const [error, setError] = useState<string>("")
   const router = useRouter()

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
   })

   const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      try {
         setError("")

         const response = await login(data)

         if (!response.success) {
            toast.error("Authentication failed.",
               {
                  description: response.message,
                  style: {
                     backgroundColor: '#FF6666',
                     color: '#000'
                  },
               }
            )
            console.log(response.error);
            return
         }

         // Redirection après connexion réussie
         toast.success("Connexion réussi. Bienvenue !")
         router.push("/")
         router.refresh()

      } catch (err) {
         toast.error("An unexpected error occurred. Please try again.")
         console.error("Login error:", err)
      }
   }

   return (
      <form
         className={cn("flex flex-col gap-6", className)}
         onSubmit={handleSubmit(onSubmit)}
         {...props}
      >
         <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-muted-foreground">
               Enter your email below to login to your account
            </p>
         </div>

         <div className="grid gap-6">
            {/* Champ Email */}
            <div className="grid gap-2">
               <Label htmlFor="email">Email</Label>
               <div className="relative">
                  <UserCircle2
                     className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                     size={20}
                  />
                  <Input
                     id="email"
                     type="email"
                     className="h-10 w-full pl-8 border border-gray-300 focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg bg-muted/50 placeholder:text-gray-400"
                     placeholder="example@domain.com"
                     {...register("email", {
                        required: "Email is required",
                        pattern: {
                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                           message: "Invalid email address",
                        },
                     })}
                  />
                  {errors.email && (
                     <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>
                  )}
               </div>
            </div>

            {/* Champ Password */}
            <div className="grid gap-2 relative">
               <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                     href="#"
                     className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                     Forgot your password?
                  </a>
               </div>
               <div className="relative">
                  <LockKeyhole
                     className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                     size={20}
                  />
                  <Input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     className="h-10 w-full pl-10 border border-gray-300 focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg bg-muted/50 placeholder:text-gray-400"
                     placeholder="••••••••"
                     {...register("password", {
                        required: "Password is required",
                        minLength: {
                           value: 8,
                           message: "Password must be at least 8 characters long",
                        },
                     })}
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  >
                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                     <p className="text-sm text-red-500 mt-1">{String(errors.password.message)}</p>
                  )}
               </div>
            </div>

            {/* Erreurs générales */}
            {error && (
               <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Bouton de soumission */}
            <Button type="submit" className="w-full bg-indigo-600 text-white focus:bg-indigo-700 hover:bg-indigo-700" disabled={isSubmitting}>
               {isSubmitting ? (
                  <div className="flex items-center gap-1">
                     <Loader2 className="animate-spin text-white" size={15} />
                     <span className="text-white">Traitement...</span>
                  </div>
               ) : "Login"}
            </Button>
         </div>
      </form>
   )
}
