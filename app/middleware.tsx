import { auth as middleware } from "@/src/lib/auth"

export default middleware((req) => {
   
   if (!req.auth && req.nextUrl.pathname !== "/login") {
      const newUrl = new URL("/login", req.nextUrl.origin)
      return Response.redirect(newUrl)
   }
})

export const config = {
   matcher: [
      "(dashboard)/:path*",
      "/((?!api|_next/static|_next/image|favicon.ico).*)"
   ],
}