import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Eye, LockKeyhole, UserCircle2 } from "lucide-react"

export const LoginForm = ({
   className,
   ...props
}: React.ComponentPropsWithoutRef<"form">) => {
   return (
      <form className={cn("flex flex-col gap-6", className)} {...props}>
         <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-balance text-sm text-muted-foreground">
               Enter your email below to login to your account
            </p>
         </div>
         <div className="grid gap-6">
            <div className="grid gap-2 relative">
               <Label htmlFor="email">Email</Label>
               <UserCircle2
                  className="absolute top-1/2 left-2 text-gray-400 dark:text-gray-500"
                  size={22}
               />
               <Input id="email" type="email" className="h-10 w-full pl-10 pr-10 border border-gray-950 dark:border-white focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg bg-muted/50 placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="m@example.com" required />
            </div>
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
               <LockKeyhole
                  className="absolute top-1/2 left-2 text-gray-400 dark:text-gray-500"
                  size={22}
               />
               <Input id="password" type="password" className="h-10 w-full pl-10 pr-10 border border-gray-950 dark:border-white focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg bg-muted/50 placeholder:text-gray-400 dark:placeholder:text-gray-500" required />
               <Eye
                  className="absolute top-1/2 right-2 text-gray-400 dark:text-gray-500"
                  size={22}
               />
            </div>
            <Button type="submit" className="w-full">
               Login
            </Button>
         </div>
      </form>
   )
}
