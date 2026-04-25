import { redirect } from "next/navigation";

// Root page redirects to default locale (Hindi)
export default function RootPage() {
  redirect("/hi");
}
