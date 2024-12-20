export default function LoginLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return <section className="fixed top-0 left-0 z-50 w-screen">{children}</section>
}