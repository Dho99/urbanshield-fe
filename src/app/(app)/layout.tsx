import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar, Topbar } from "@/components/layout/nav";

// Session guard reads request headers, so this subtree must render dynamically.
export const dynamic = "force-dynamic";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="lg:hidden">
          <Topbar title="UrbanShield AI" />
        </div>
        {children}
      </div>
    </div>
  );
}
