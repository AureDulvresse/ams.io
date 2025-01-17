import { permanentRedirect } from "next/navigation";

export default function Home() {
  setTimeout(() => console.log("Loading..."), 50000);
  permanentRedirect("/dashboard");
}
