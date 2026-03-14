import { Topbar } from "@/components/layout/Topbar";
import { getUserByNikNpwp, getCurrentUser } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            <Topbar user={user} />
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
